// 导出员工的路由规则
import Layout from '@/layout'
export default {
    // 路由规则
    path:'/salarys',
    name:'salarys', // 给模块的一级路由加一个name属性，这个属性我们会在后面做权限的时候用到
    component: Layout,
    children:[{
        path:'',
        component:() => import('@/views/salarys/index'),
        meta: { 
            title:'工资' // 这里为什么要用title 因为左侧导航读取了这里的title属性
         }
    }],
}