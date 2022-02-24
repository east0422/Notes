# 工作中遇见的issue及解决方案

### JS
   1. Date.parse在iOS系统真机上不支持2018-08-30格式会解析为NaN，需要转化为2018/08/30格式(dateStr.replace(/-/g, '/'))。
   2. border-collapse在chrome上边框粗细不一致。
      ```
         // 修复chrome部分border重叠导致看起来border高度不一致。
         // 注意：将样式设在table父层容器上且在table上不要设置border或设置为0。只能用在展示上，若使用到打印上则打印出来无边框
         .fixChromeTableBorder {
            table {
               border-top: solid 1px #000000;
               border-collapse: separate !important; /* the default option */
               border-spacing: 0; /* remove border gaps */
               th, td {
                  border-right: solid 1px #000000;
                  border-bottom: solid 1px #000000;
               }
               th:first-child, td:first-child {
                  border-left: solid 1px #000000;
               }
            }
         }
      ```
