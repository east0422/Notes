import request from "@/utils/request";
import { getAgencyCompanyCode, getUserCode } from "@/utils/auth"

// const uploadBaseUrl = process.env.VUE_APP_BASE_UPLOAD_API;
const dataSource = "datasource"; // 数据源
const type = "userFile"; // 文件类型分类

/** 阿里云OSS */

// 多文件上传
export function uploadFiles(files, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", dataSource); 
  formData.append("type", type); 
  for(let file of files){
    formData.append("file", file);
  }
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/filesUpload",
    headers: {},
    method: "post",
    data: formData,
    onUploadProgress: progressCallback
  });
}

// 单文件上传
export function uploadFile(file, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", dataSource); 
  formData.append("file", file);
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/upload",
    headers: {},
    method: "post",
    data: formData,
    onUploadProgress: progressCallback
  });
}

// 单文件上传
export function uploadById(file,info, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", info.dataSource); 
  formData.append("foulder", info.foulder); 
  formData.append("source", info.source); 
  formData.append("file", file);
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/uploadById",
    headers: {},
    method: "post",
    data: formData,
    onUploadProgress: progressCallback
  });
}

// 单文件上传（文件替换）
export function uploadByFid(file,info, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", info.dataSource); 
  formData.append("foulder", info.foulder); 
  formData.append("source", info.source); 
  formData.append("file", file);
  formData.append("fid", info.fid);
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/uploadByFid",
    headers: {},
    method: "post",
    data: formData,
    onUploadProgress: progressCallback
  });
}

// 文件下载
export function downloadFile(fileUrl, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", dataSource); 
  formData.append("fileUrl", fileUrl)
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/download/exportList",
    method: "post",
    data: formData,
    responseType: "blob",
    onDownloadProgress: progressCallback
  });
}

// 文件下载
export function downloadFileByFid(fId, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", dataSource); 
  formData.append("fId", fId)
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/downloadById/exportList",
    method: "post",
    data: formData,
    responseType: "blob",
    onDownloadProgress: progressCallback
  });
}


// 多文件上传(返回文件id数组)
export function uploadFilesResultIds(files,info, progressCallback = () => {}) {
  let formData = new FormData();
  formData.append("dataSource", info.dataSource); 
  formData.append("foulder", info.foulder); 
  formData.append("source", info.source); 
  for(let file of files){
    formData.append("file", file);
  }
  return request({
    // baseURL: uploadBaseUrl,
    url: "/file/OSS/filesUploadResultId",
    headers: {},
    method: "post",
    data: formData,
    onUploadProgress: progressCallback
  });
}

// 附件列表查询
export function fileList(fileCode) {
  return request({
    url: `/company/file/list`,
    method: "post",
    data:{
      agencyCompanyCode:getAgencyCompanyCode(),
      fileCode,
    }
  });
}

// 附件删除
export function fileDel(id) {
  return request({
    url: `/company/file/delete`,
    method: "post",
    data:{
      id,//必传- 文件id
    }
  });
}

// 附件修改
export function fileEdit(id,fileInstruction) {
  return request({
    url: `/company/file/edit`,
    method: "post",
    data:{
      id,//必传- 文件id
      fileInstruction,//必传- 附件说明
    }
  });
}

// 附件新增
export function fileAdd(fileCode, ids, fileType="0") {
  return request({
    url: "/company/file/add",
    method: "post",
    data: {
      agencyCompanyCode: getAgencyCompanyCode(),
      userCode: getUserCode(),
      fileCode: fileCode,// 文件标识（公司编码或者合同编码）
      files: ids,//文件id
      fileType: fileType //文件类型0:公司文件；1合同文件；2其他	
    }
  });
}