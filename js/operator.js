// 设置画布初始属性
const canvasMain = document.querySelector('.canvasMain');
const canvas = document.getElementById('canvas');
const resultGroup = document.querySelector('.resultGroup');
const mapType = {
	"0": {
		type: "正常",
		color: "28,214,34",
		rgb: "#1CD622"
	},
	"1": {
		type: "交叉一次",
		color: "39,152,232",
		rgb: "#2798E8",
	},
	"2": {
		type: "畸形血管",
		color: "255,0,0",
		rgb: "#FF0000",
	}
}

// 设置画布宽高背景色
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
canvas.style.background = "#8c919c";

const annotate = new LabelImage({
	canvas: canvas,
	scaleCanvas: document.querySelector('.scaleCanvas'),
	scalePanel: document.querySelector('.scalePanel'),
	annotateState: document.querySelector('.annotateState'),
	canvasMain: canvasMain,
	resultGroup: resultGroup,
	crossLine: document.querySelector('.crossLine'),
	labelShower: document.querySelector('.labelShower'),
	screenShot: document.querySelector('.screenShot'),
	screenFull: document.querySelector('.screenFull'),
	colorHex: document.querySelector('#colorHex'),
	toolTagsManager: document.querySelector('.toolTagsManager'),
	historyGroup: document.querySelector('.historyGroup'),
	showHistory: document.querySelector('.showHistory'),
	history: document.querySelector('.history'),
	historyGroupModal: document.querySelector('.historyGroupModal'),
	dateInput: document.querySelector('#test1-btn'),
	keyWordInput: document.querySelector('#test2-btn'),
	closeModalLabel: document.querySelector('.closeLabelManage'),
});

// 初始化交互操作节点
const prevBtn = document.querySelector('.pagePrev');                    // 上一张
const nextBtn = document.querySelector('.pageNext');                    // 下一张
const taskName = document.querySelector('.pageName');                   // 标注任务名称
const processIndex = document.querySelector('.processIndex');           // 当前标注进度
const processSum = document.querySelector('.processSum');               // 当前标注任务总数

let imgFiles = ['./images/example/football.jpg', './images/example/person.jpg', './images/example/band.jpg',
	'./images/example/street.jpg', './images/example/dog.jpeg', './images/example/cat.jpg', './images/example/dogs.jpg',
	'./images/example/furniture.jpg', './images/example/basketball.jpg', './images/example/alley.jpg'];    //选择上传的文件数据集
let imgIndex = 1;       //标定图片默认下标;
let imgSum = 10;        // 选择图片总数;

initImage();
// 初始化图片状态
function initImage() {
	// selectImage(0);
	// initEditor();
	$('#canvas').css('display', 'none');
	$('.scaleBox').css('display', 'none');
	$('.selectOperation').css("display", "none");
	$('.videoEdit').css("display", "block");
	processSum.innerText = imgSum;
}

function initEditor() {
	let qlEditorContent = document.querySelector('.ql-editor');
	let task = localStorage.getItem(taskName.innerText.split('.')[0]);
	if (task) {
		qlEditorContent.innerHTML = task;
	}
}

//切换操作选项卡
let tool = document.getElementById('tools');
tool.addEventListener('click', function (e) {
	for (let i = 0; i < tool.children.length; i++) {
		tool.children[i].classList.remove('focus');
	}
	e.target.classList.add('focus');
	switch (true) {
		case e.target.className.indexOf('toolDrag') > -1:  // 拖拽
			annotate.SetFeatures('dragOn', true);
			break;
		case e.target.className.indexOf('toolRect') > -1:  // 矩形
			annotate.SetFeatures('rectOn', true);
			break;
		case e.target.className.indexOf('toolPolygon') > -1:  // 多边形
			annotate.SetFeatures('polygonOn', true);
			break;
		case e.target.className.indexOf('toolTagsManager') > -1:  // 标签管理工具
			annotate.SetFeatures('tagsOn', true);
			break;
		default:
			break;
	}
});

// 获取下一张图片
nextBtn.onclick = function () {
	annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(taskName.textContent, JSON.stringify(annotate.Arrays.imageAnnotateMemory));  // 保存已标定的图片信息
	if (imgIndex >= imgSum) {
		imgIndex = 1;
		selectImage(0);
	}
	else {
		imgIndex++;
		selectImage(imgIndex - 1);
	}
};

// 获取上一张图片
prevBtn.onclick = function () {
	annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(taskName.textContent, JSON.stringify(annotate.Arrays.imageAnnotateMemory));  // 保存已标定的图片信息
	if (imgIndex === 1) {
		imgIndex = imgSum;
		selectImage(imgSum - 1);
	}
	else {
		imgIndex--;
		selectImage(imgIndex - 1);
	}
};

document.querySelector('.openFolder').addEventListener('click', function () {
	document.querySelector('.openFolderInput').click()
});

document.querySelector('.openVideo').addEventListener('click', function () {
	document.querySelector('.openVideoInput').click()
});

function changeFolder(e) {
	imgFiles = e.files;
	imgSum = imgFiles.length;
	processSum.innerText = imgSum;
	imgIndex = 1;
	selectImage(0);
}

function selectImage(index) {
	openBox('#loading', true);
	$('.selectOperation').css('display', "block");
	processIndex.innerText = imgIndex;
	taskName.innerText = imgFiles[index].name || imgFiles[index].split('/')[3];
	let content = localStorage.getItem(taskName.textContent);
	let img = imgFiles[index].name ? window.URL.createObjectURL(imgFiles[index]) : imgFiles[index];
	content ? annotate.SetImage(img, JSON.parse(content)) : annotate.SetImage(img);
}

document.querySelector('.saveJson').addEventListener('click', function () {
	let filename = taskName.textContent.split('.')[0] + '.json';
	annotate.Arrays.imageAnnotateMemory.length > 0 ? saveJson(annotate.Arrays.imageAnnotateMemory, filename) : alert('当前图片未有有效的标定数据');
});

function saveJson(data, filename) {
	if (!data) {
		alert('保存的数据为空');
		return false;
	}
	if (!filename) {
		filename = 'json.json';
	}
	if (typeof data === 'object') {
		data = JSON.stringify(data, undefined, 4);
	}
	let blob = new Blob([data], { type: 'text/json' }),
		e = document.createEvent('MouseEvent'),
		a = document.createElement('a');
	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e)
}

//弹出框
function openBox(e, isOpen) {
	let el = document.querySelector(e);
	let maskBox = document.querySelector('.mask_box');
	if (isOpen) {
		maskBox.style.display = "block";
		el.style.display = "block";
	}
	else {
		maskBox.style.display = "none";
		el.style.display = "none";
	}
}

$('.titleHistoryContent').on('click', '.downloadReport', function () {
	// let frame = annotate.Nodes.image.dataset.id;
	let obj = new Object();
	obj["video"] = '133';
	obj["frame"] = '3';
	obj["清晰度"] = "清晰";
	obj["管袢数"] = ">=7";
	obj["输入枝管径"] = "13";
	obj["输出枝管径"] = "19";
	obj["输出/输入枝管径"] = "1.5";
	obj["袢顶直径"] = "26";
	obj["管袢长"] = "166";
	obj["交叉管袢数"] = "<=30%";
	obj["畸形管袢数"] = "<=10%";
	obj["流速"] = "粒流";
	obj["血管运动性"] = "0--1";
	obj["红细胞聚集"] = "重度";
	obj["白细胞数"] = "1--30";
	obj["白微栓"] = ">2";
	obj["血色"] = "暗红";
	obj["渗出"] = "+";
	obj["出血"] = "无";
	obj["乳头下静脉丛"] = ">2排，扩张";
	obj["乳头"] = "平坦";
	obj["汗腺导管"] = "0--2";
	debounce(buildReport(obj), 3000, true);
	// if (frame) {
	// 	console.log('x');
	// 	debounce(buildReport(video, frame, { a: "sfdwetgfewrgwt" }), 3000, true);
	// }
})

function debounce(func, wait, immediate) {
	let timer;
	return function () {
		let context = this;
		let args = arguments;
		if (timer) clearTimeout(timer);
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timer = setTimeout(function () {
				func.apply(context, args)
			}, wait);
		}
	}
}


/**
 * 4. 生成诊断报告
 * @param {*} json 
 */
function buildReport(obj) {
	$.ajax({
		url: "http://ailw.xianglu-china.com/report/ReportGen",
		type: "post",
		dataType: 'JSON',
		data: JSON.stringify(obj),
		success: (res) => {
			if (res.report_gen_code === 2) {
				let msg = "正在处理中......";
				$('.e-inspect').text(msg);
				$('.e-eval').text(msg);
				$('.e-suggest').text(msg);
				setTimeout(() => {
					getReport(obj["video"], obj["frame"])
				}, 5000)
			}
		},
		error: () => {
			console.log("失败");
		}
	})
}

/**
 * 轮询，展示报告
 * @param {*} param1 
 * @param {*} param2 
 */
function getReport(param1, param2) {
	let obj = new Object();
	obj["video"] = param1;
	obj["frame"] = param2;
	$.ajax({
		url: "http://ailw.xianglu-china.com/report/getReport",
		type: "post",
		dataType: 'JSON',
		data: JSON.stringify(obj),
		success: (res) => {
			if ((res.error_code === 0) || (res.error_code === 1)) {
				let msg = "正在处理中......";
				$('.e-inspect').text(msg);
				$('.e-eval').text(msg);
				$('.e-suggest').text(msg);
				setTimeout(() => {
					getReport(obj["video"], obj["frame"]);
				}, 10000)
			} else if (res.error_code === 2) {
				$('.e-inspect').text(res.inspect);
				$('.e-eval').text(res.eval);
				$('.e-suggest').text(res.suggest);
			}
		},
		error: () => {
			console.log("失败");
		}
	})
}


let detectingImg;
// 血管检测
$("#screenShot").on("click", ".anal-pic", function () {
	let video = $('.pageName').text();
	detectingImg = $($(this)[0].parentElement.parentElement.childNodes[0])[0];
	let frame = detectingImg.getAttribute('data-id');
	$('.loading').show();
	detecting('1.wmv', frame);
	let ctxNode = canvas;
	ctxNode.height = ctxNode.height;
	$('#canvas').css('display', 'block');
	$('.scaleBox').css('display', 'block');
	$('.videoEdit').css("display", "none");
	$('.selectOperation').css('display', "none");
})

// 血管分析
$("#title-analysis").on("click", ".analysis", function () {
	let xyData = annotate.Arrays.imageAnnotateMemory;
	if (xyData.length) {
		let temp = null;
		// let video = $('.pageName').text();
		let video = "1.wmv";
		let frame = annotate.Nodes.image.dataset.id;
		let xys = annotate.Arrays.imageAnnotateMemory.map(v => {
			console.log(v.rectMask);
			temp = Object.values(v.rectMask);
			return [temp[0], temp[1], temp[0] + temp[2], temp[1] + temp[3]]
		});
		annotate.Arrays.paramsArray = [];
		xys.forEach((v, index) => {
			setTimeout((video, frame, v) => {
				analysis(video, frame, v[0], v[1], v[2], v[3]);
			}, 2000 * (1 + index / 5), video, frame, v)
		})
	}
})

$('.closeDiv').on('click', '.expend-quit', function () {
	$('.resultSelectLabel').removeClass('focus')
	$('.resultSelectLabel').addClass('blur')
})

/**
 * 1. 血管检测
 * @param {*} video
 * @param {*} frame 
 */
function detecting(video, frame) {
	$.ajax({
		url: "http://ailw.xianglu-china.com/vessel/vesselDet",
		type: "get",
		dataType: 'JSON',
		data: { video, frame },
		success: (res) => {
			$('.loading').hide();
			let xys = res.xy.split("\n").filter(v => v).map(v => v.trim());
			let datas = xys.map(v => v.split(' '));
			let data = datas.map(v => {
				return {
					"content": [
						{
							"x": v[1],
							"y": v[2],
						},
						{
							"x": v[3],
							"y": v[2],
						},
						{
							"x": v[3],
							"y": v[4],
						},
						{
							"x": v[1],
							"y": v[4],
						}
					],
					"rectMask": {
						"xMin": v[1],
						"yMin": v[2],
						"width": v[3] - v[1],
						"height": v[4] - v[2],
					},
					"labels": {
						"labelName": mapType[v[0]].type,
						"labelColor": mapType[v[0]].rgb,
						"labelColorRGB": mapType[v[0]].color,
						"visibility": false
					},
					"labelLocation": {
						"x": 489,
						"y": 229.5
					},
					"contentType": "rect"
				}
			})
			annotate.SetImage(detectingImg, data);
			$('#canvas').attr('data-id', detectingImg["data-id"]);
			// datas.forEach((v, index) => {
			// 	setTimeout((video, frame, v) => {
			// 		analysis(video, frame, v[1], v[2], v[3], v[4]);
			// 	}, 3000 * (1 + index / 5), video, frame, v)
			// })
		},
		error: () => {
			console.log("失败");
		}
	})
}

/**
 * 2. 血管分析
 * @param {*} video 
 * @param {*} frame 
 * @param {*} x 矩形左下角坐标
 * @param {*} y 矩形右下角坐标
 */
function analysis(video, frame, leftX, leftY, rightX, rightY) {
	let xy = `${Math.round(leftX)}_${Math.round(leftY)}_${Math.round(rightX)}_${Math.round(rightY)}`;
	$.ajax({
		url: "http://ailw.xianglu-china.com/vessel/imgAna",
		type: "get",
		dataType: 'JSON',
		data: { video, frame, xy },
		success: (res) => {
			console.log(res);
			setTimeout((video, frame, xy) => {
				getImgData(video, frame, xy)
			}, 5000, video, frame, xy)
		},
		error: () => {
			console.log("失败");
		}
	})
}

/**
 * 3. 获取数据的接口
 * @param {*} video 
 * @param {*} frame 
 * @param {*} xy 
 */
function getImgData(video, frame, xy) {
	$.ajax({
		url: "http://ailw.xianglu-china.com/vessel/getImgData",
		type: 'get',
		dataType: 'json',
		data: { video, frame, xy },
		success: function (data) {
			if (data.retCode === 0) {
				let d = Object.values(data);
				d.splice(d.length - 1, 1);
				annotate.Arrays.paramsArray.push(d);
			} else {
				setTimeout((video, frame, xy) => { getImgData(video, frame, xy) }, 5000, video, frame, xy);
			}
		},
		error: () => {
			setTimeout((video, frame, xy) => { getImgData(video, frame, xy) }, 5000, video, frame, xy);
		}
	})
}
