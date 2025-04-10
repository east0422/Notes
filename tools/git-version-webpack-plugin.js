const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const jsYaml = require('js-yaml');

const isJSON = content => {
  if (typeof content === 'string') {
    try {
      JSON.parse(content);
      return true;
    } catch (e) {
      console.warn('\x1B[33m%s\x1B[0m', `json format error: ${e}`);
      return false;
    }
  }
  return false;
};

const isYaml = content => {
  if (typeof content === 'string') {
    try {
      jsYaml.load(content);
      return true;
    } catch (e) {
      console.warn('\x1B[33m%s\x1B[0m', `yaml format error: ${e}`);
      return false;
    }
  }
  return false;
};

const isObject = content => {
  if (content === undefined || content === null) return false;
  if (Array.isArray(content)) return false;
  if (typeof content === 'object') {
    if (content instanceof RegExp) return false;
    if (content instanceof Date) return false;
    if (Object.keys(content)?.length === 0) return false;
  }
  return true;
};

const isFunction = func => typeof func === 'function';

class GitVersionWebpackPlugin {
  constructor(options = {}) {
    // 全局变量
    this.variableFn = isFunction(options.variable) ? options.variable : undefined;
    // 文件
    this.fileFn = isFunction(options.file) ? options?.file : undefined;
    // 环境变量
    this.envFn = isFunction(options.env) ? options.env : undefined;
    // 定义环境变量插件
    this._DefinePlugin = options.DefinePlugin;
  }

  // 输出
  extendProcessEnv(compiler, gitInfo) {
    if (typeof this.envFn === 'function' && this.DefinePlugin) {
      this._env = this.envFn(gitInfo);
      // 注入git信息到环境变量
      const defaultPlugin = new this.DefinePlugin({ 'process.env': Object.keys(this._env || {}).reduce((env, key) => {
        env[key] = JSON.stringify(this._env[key]);
        return env;
      }, {}) });
      defaultPlugin.apply(compiler);
    }
  }

  findGitDir(prePath) {
    const currentPath = path.join(prePath, './.git');
    if (fs.existsSync(currentPath)) {
      return prePath;
    }
    if (prePath === path.resolve('/')) {
      return '';
    }
    return this.findGitDir(path.join(prePath, '../'));
  }

  async findGitInfo() {
    if (this.gitInfo) return;
    const dir = this.findGitDir(process.cwd());
    const gitInfo = {};
    if (dir) {
      const gitDir = path.join(dir, './.git');
      const branchHead = fs.readFileSync(path.join(gitDir, './HEAD'), { encoding: 'utf-8' });
      if (branchHead) {
        const [, ...branchPath] = branchHead.replace(/\n|\r/g, '').split('/');
        if (branchPath?.length > 0) {
          gitInfo.branch = branchPath[branchPath.length - 1];
        }
        let commit;
        const commitList = await git.log({ fs, dir, depth: 1 });
        if (commitList?.length) {
          commit = commitList[0]?.commit;
          gitInfo.commitId = commitList[0]?.oid;
        }
        if (commit) {
          const { committer } = commit || {};
          gitInfo.author = committer?.name;
          gitInfo.timestamp = committer?.timestamp;
          gitInfo.time = new Date(committer?.timestamp * 1000).toLocaleString();
          gitInfo.message = commit.message;
          gitInfo.email = committer?.email;
        }
      }
    }
    this.gitInfo = gitInfo;
  }

  generateFileInfo(gitInfo) {
    if (typeof this.fileFn === 'function') {
      const { name, content } = this.fileFn(gitInfo) || {};
      if (!content || !name) return undefined;
      const fileType = name.split('.').pop();
      if (fileType === 'json') {
        const checkFlag = isJSON(content);
        if (checkFlag || isObject(content)) {
          let fileContent = checkFlag ? JSON.parse(content) : content;
          fileContent = JSON.stringify(fileContent, null, '\t');
          return {
            name,
            content: fileContent,
          };
        }
      } if (fileType === 'yaml' || fileType === 'yml') {
        const checkFlag = isYaml(content);
        if (checkFlag || isObject(content)) {
          const fileContent = isYaml(content) ? content : jsYaml.dump(content);
          return {
            name,
            content: fileContent,
          };
        }
      }
    }
    return undefined;
  }

  async apply(compiler) {
    // 获取git信息，输出环境变量
    compiler.hooks.beforeCompile.tapAsync('GitVersionWebpackPlugin', async (_, callback) => {
      await this.findGitInfo();
      if (this.envFn) {
        const DefinePlugin = this.__DefinePlugin || (compiler.options?.plugins || []).find(plugin => plugin.constructor.name === 'DefinePlugin');
        if (!DefinePlugin) {
          console.warn('\x1B[33m%s\x1B[0m', 'DefinePlugin not found in webpack or options, can not output env');
        }
        if (typeof DefinePlugin?.constructor === 'function' && !this.DefinePlugin) {
          this.DefinePlugin = DefinePlugin.constructor;
          this.extendProcessEnv(compiler, this.gitInfo);
        }
      }
      callback();
    });
    compiler.hooks.emit.tapAsync('GitVersionWebpackPlugin', async (compilation, callback) => {
      this._file = this.generateFileInfo(this.gitInfo);
      if (this._file) {
        if (compilation.assets) {
          compilation.assets[this._file.name] = {
            source: () => this._file.content,
            size: () => this._file.content.length,
          };
        }
      }
      callback();
    });
  }
}

module.exports = GitVersionWebpackPlugin;
