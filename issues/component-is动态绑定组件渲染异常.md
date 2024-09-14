component-is动态绑定组件渲染异常

vue(2.7.13) + webpack(4.46.0)

页面中使用<component :is="curComp.componentName" :conf="curComp.conf" />动态渲染绑定组件及组件数据渲染异常

1、渲染同一个组件但是conf配置不同数据渲染混乱，增加key值可解决<component :is="curComp.componentName" :conf="curComp.conf" :key="index" />
2、一个动态组件添加到body后再切换另一个组件时也会添加到body会导致样式错乱，将需要渲染到不同地方的组件分开来渲染可解决，对特殊组件可直接渲染不使用component。<CompA v-if="centerPanelConfig.visible && centerPanelConfig.component == 'CompA'" :conf="centerPanelConfig.data" /><compB v-else-if="centerPanelConfig.visible && centerPanelConfig.component != 'CompA'" :conf="centerPanelConfig.data" />
