new jBox('Tooltip', {
  attach: '#Tooltip-2',
  theme: 'TooltipBorderThick',
  width: 200,
  position: {
    x: 'left',
    y: 'center'
  },
  outside: 'x',
  pointer: 'top:15',
  content: 'You have many options to position and animate your jBoxes',
  animation: 'move'
});

new jBox('Mouse', {
  attach: '#featureList1',
  position: { x: 'right', y: 'bottom' },
  content: '全屏开关'
});

new jBox('Mouse', {
  attach: '#featureList2',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>导入视频</strong>
            <div>导入血管视频进行分析</div>
          `
});

new jBox('Mouse', {
  attach: '#featureList5',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>查看历史记录</strong>
            <div>通过搜索历史记录，重现当时的标注结果（结果不可编辑）</div>
          `
});

new jBox('Mouse', {
  attach: '#btn-picshot',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>截图</strong>
            <div>截图图片，进行检测</div>
          `
});


new jBox('Mouse', {
  attach: '#tools-toolDrag',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>图片拖拽</strong>
            <div>调整图片位置，滚动鼠标滑轮进行图片的放大与缩小</div>
          `
});

new jBox('Mouse', {
  attach: '#tools-toolTagsManager',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>标签管理</strong>
            <div>管理标签，进行标签的编辑</div>
          `
});

new jBox('Mouse', {
  attach: '#tools-toolRect',
  position: { x: 'right', y: 'bottom' },
  content: `
            <strong>矩形工具</strong>
            <div>点击矩形工具，对图片进行矩阵标注</div>
          `
});

new jBox('Mouse', {
  attach: '#showAllLabels',
  position: { x: 'left', y: 'bottom' },
  content: "控制所有的标注结果显示/隐藏标签"
})

new jBox('Mouse', {
  attach: '#tools-returnVideo',
  position: { x: 'right', y: 'bottom' },
  content: '返回视频帧选取界面'
});

new jBox('Modal', {
  attach: '#featureList5',
  width: 550,
  height: 200,
  blockScroll: false,
  animation: 'zoomIn',
  draggable: 'title',
  closeButton: true,
  content: `
    <div class="history-modal">
    <div class="history-query">
      <label class="history-label">日期</label>
      
    </div>
    <div class="history-query">
      <label class="history-label">关键字</label>
      <input type="text" name="keywords" id="test2" placeholder="请输入" class="layui-input">
    </div>
    <div class="history-btn-wrapper"><div id="test1-btn" class="history-btn">确定</div></div>
    </div>
    `,
  title: '历史记录查询',
  overlay: false,
  reposition: false,
  repositionOnOpen: false
});

layui.use('laydate', function () {
  var laydate = layui.laydate;
  //常规用法
  laydate.render({
    elem: '#test1'
  });
});