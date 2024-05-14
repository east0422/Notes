import Vue from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import moment from 'moment'

import api from '@/api'
moment.locale('zh-cn')

Vue.prototype.$api = api
Vue.prototype.$echarts = echarts
Vue.prototype.$moment = moment
Vue.prototype.$Bus = new Vue()

