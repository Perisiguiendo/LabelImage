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
  content: '导入视频'
});

new jBox('Mouse', {
  attach: '#featureList4',
  position: { x: 'right', y: 'bottom' },
  content: '标注结果显示开关'
});

new jBox('Mouse', {
  attach: '#featureList5',
  position: { x: 'right', y: 'bottom' },
  content: '查看历史记录'
});

new jBox('Mouse', {
  attach: '#btn-picshot',
  position: { x: 'right', y: 'bottom' },
  content: '截图'
});


new jBox('Mouse', {
  attach: '#tools-toolDrag',
  position: { x: 'right', y: 'bottom' },
  content: '图片拖拽'
});
new jBox('Mouse', {
  attach: '#tools-toolTagsManager',
  position: { x: 'right', y: 'bottom' },
  content: '标签管理'
});
new jBox('Mouse', {
  attach: '#tools-toolRect',
  position: { x: 'right', y: 'bottom' },
  content: '矩形工具'
});
new jBox('Mouse', {
  attach: '#tools-toolPolygon',
  position: { x: 'right', y: 'bottom' },
  content: '多边形工具'
});

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
        <input type="text" class="layui-input" id="test1" placeholder="默认为当天">
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