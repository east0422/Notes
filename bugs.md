# 工作中遇见的issue及解决方案

### JS
   1. Date.parse在iOS系统真机上不支持2018-08-30格式会解析为NaN，需要转化为2018/08/30格式(dateStr.replace(/-/g, '/'))。
   