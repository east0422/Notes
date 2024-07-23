<el-input v-model="inputVal" placeholder="请输入内容"></el-input>

在js中对inputVal值做判断，输入0时!inpuVal结果竟然为false，!0应该为true才对。

浅析: 输入0时, inputVal类型为字符串'0', 字符串'0'为true, !'0'为false

可以使用v-model.number会将输入后的值转为整数，会忽略负号和数字之外的字符
还可以使用el-input-number，绑定的值也是数字类型，可输入浮点数
