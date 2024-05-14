vite加载src/assets中静态资源失败

vue(3.4.19) + vite(5.1.4)

依据imgName动态加载本地src中静态资源图片 <img :src="getAssetsImg(imgName)" />

vite使用new URL(url, import.meta.url)显示动态加载本地静态资源

  ```
  // 获取assets静态图片资源
  const getAssetsImg = (imgName?: string): string => {
    if (!imgName) {
      return ''
    }
    if (imgName.startsWith('http:') || imgName.startsWith('https:')) {
      return imgName
    }
    try {
      // new URL中不能使用@，../为相对路径(不同位置可能不同，也可能为../../，建议封装为方法)
      return new URL(`../assets/${url}`, import.meta.url).href
    } catch (error) {
      return ''
    }
  }
  ```

问题原因：使用了@和错误的相对路径