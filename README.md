# particles.js
a canvas and svg particles show    

__site:__ https://pengjiyuan.github.io/particles.js/ 

__我用了两种方式实现了粒子动态连线效果。__    
__但是我们都知道，操作dom的代价是昂贵的，所以我用的这种svg的实现会对浏览器造成极大的负担（我的方式是用的canvas的重绘思想，频繁的移除加重绘svg元素,不推荐！在点的距离判断然后连线的实现方法上，找不到什么比较好的判断方法，
心想总不会两两比较吧，这样频繁的重绘计算浏览器能吃的消吗，看了一个particles大项目的源码，发现还真是，是我低估了浏览器的计算能力...）__    

__用canvas实现明显浏览器会更从容，我还添加了鼠标move连线效果，svg还是想想算了（应该是我的方式错了，期待后续找到更优解法）__    

svg的能力当然不仅如此，之后我会用一种最优的方式实现，我相信svg不比canvas差。  

后续可能会增加它的定制化内容~
