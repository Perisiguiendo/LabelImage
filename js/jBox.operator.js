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
  attach: '#tools-toolTagsManager',
  width: 350,
  height: 200,
  blockScroll: false,
  animation: 'zoomIn',
  draggable: 'title',
  closeButton: true,
  content: 'You can move this modal window',
  title: 'Click here to drag me around',
  overlay: false,
  reposition: false,
  repositionOnOpen: false
});