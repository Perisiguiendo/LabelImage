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

let labelsInit = `[{"labelName":"正常","labelColor":"#1cd622","labelColorR":"255","labelColorG":"0","labelColorB":"0"},{"labelName":"交叉一次","labelColor":"#2798e8","labelColorR":"255","labelColorG":"0","labelColorB":"0"},{"labelName":"畸形血管","labelColor":"#ff0000","labelColorR":"255","labelColorG":"0","labelColorB":"0"}]`;
if (!localStorage.getItem("labels")) {
	localStorage.setItem("labels", labelsInit);
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
	screenFull: document.querySelector('.screenFull'),
	colorHex: document.querySelector('#colorHex'),
	toolTagsManager: document.querySelector('.toolTagsManager'),
	history: document.querySelector('.history'),
	labelsNode: document.querySelector('.headDisplay'),
	// selectBtm: document.querySelector('.selectBtm')
});

let detectingImg = null;

initState();
function initState() {
	jQuery('#canvas').css('display', 'none');
	jQuery('.scaleBox').css('display', 'none');
	jQuery('.videoEdit').css("display", "block");
	jQuery('.toolSet-return').css('display', 'none')
	jQuery('.tools-up').css('display', 'none');
	jQuery('ins-arrow').hide();
	jQuery('.commentResult').hide();
}

//切换操作选项卡
let tool = document.getElementsByClassName('tools-up')[0];
tool.addEventListener('click', function (e) {
	for (let i = 0; i < tool.children.length - 1; i++) {
		tool.children[i].children[0].classList.remove('focus');
	}
	e.target.classList.add('focus');
	switch (true) {
		case e.target.className.indexOf('toolDrag') > -1:  // 拖拽
			annotate.SetFeatures('dragOn', true);
			break;
		case e.target.className.indexOf('toolRect') > -1:  // 矩形
			annotate.SetFeatures('rectOn', true);
			break;
		case e.target.className.indexOf('toolTagsManager') > -1:  // 标签管理工具
			annotate.SetFeatures('tagsOn', true);
			break;
		default:
			break;
	}
});

document.querySelector('.openVideo').addEventListener('click', function () {
	document.querySelector('.openVideoInput').click()
});

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
 * 生成健康报告
 */
jQuery('.titleHistoryContent').on('click', '.downloadReport', function () {
	// let frame = annotate.Nodes.image.dataset.id;
	let video = annotate.Nodes.video;
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


/**
 * 4. 生成诊断报告
 * @param {*} json 
 */
function buildReport(obj) {
	jQuery.ajax({
		url: "http://ailw.xianglu-china.com/report/ReportGen",
		type: "post",
		dataType: 'JSON',
		data: JSON.stringify(obj),
		success: (res) => {
			if (res.report_gen_code === 2) {
				let msg = "正在处理中......";
				jQuery('.e-inspect').text(msg);
				jQuery('.e-eval').text(msg);
				jQuery('.e-suggest').text(msg);
				setTimeout(() => {
					getReport(obj["video"], obj["frame"])
				}, 5000)
			}
		},
		error: () => {
			toastr.error(`参数发送失败`);
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
	jQuery.ajax({
		url: "http://ailw.xianglu-china.com/report/getReport",
		type: "post",
		dataType: 'JSON',
		data: JSON.stringify(obj),
		success: (res) => {
			if ((res.error_code === 0) || (res.error_code === 1)) {
				let msg = "正在处理中......";
				jQuery('.e-inspect').text(msg);
				jQuery('.e-eval').text(msg);
				jQuery('.e-suggest').text(msg);
				setTimeout(() => {
					getReport(obj["video"], obj["frame"]);
				}, 10000)
			} else if (res.error_code === 2) {
				jQuery('.e-inspect').text(res.inspect);
				jQuery('.e-eval').text(res.eval);
				jQuery('.e-suggest').text(res.suggest);
				jQuery("#jcsjian").val(res.inspect);  // 检查所见
				jQuery("#alias").val(res.eval);   // 评估结论
				jQuery("#description").val(res.suggest);  // 健康建议
				toastr.success(`报告获取成功`);
			}
		},
		error: () => {
			toastr.error(`报告获取失败`);
		}
	})
}

// 血管检测
jQuery("#screenShot").on("click", ".anal-pic", function () {
	let video = annotate.Nodes.video;
	detectingImg = jQuery(jQuery(this)[0].parentElement.parentElement.childNodes[0])[0];
	let frame = detectingImg.getAttribute('data-id');
	jQuery('.loading').show();
	detecting('1.wmv', frame);
	let ctxNode = canvas;
	ctxNode.height = ctxNode.height;

	jQuery('#canvas').css('display', 'block');
	jQuery('.scaleBox').css('display', 'block');
	jQuery('.videoEdit').css("display", "none");
	jQuery('.featureList-video').css("display", "none");
	jQuery('.commentResult').show();
	jQuery('.toolSet-return').css('display', 'flex')
})

// 血管分析
jQuery("#title-analysis").on("click", ".analysis", debounce(analysisTitle))

function analysisTitle() {
	let xyData = annotate.Arrays.imageAnnotateMemory;
	if (xyData.length) {
		toastr.info("正在分析，请稍候...");
		let temp = null;
		// let video = annotate.Nodes.video;
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
				analysis(video, frame, v[0], v[1], v[2], v[3], index);
			}, 2000 * (1 + index / 5), video, frame, v)
		})
	} else {
		toastr.warning("标注参数为0，无法分析，请先添加图片标注");
	}
}

jQuery('.closeDiv').on('click', '.expend-quit', function () {
	jQuery('.resultSelectLabel').removeClass('focus')
	jQuery('.resultSelectLabel').addClass('blur')
})

/**
 * 1. 血管检测
 * @param {*} video
 * @param {*} frame 
 */
function detecting(video, frame) {
	jQuery.ajax({
		url: "http://ailw.xianglu-china.com/vessel/vesselDet",
		type: "get",
		dataType: 'JSON',
		data: { video, frame },
		success: (res) => {
			jQuery('.loading').hide();
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
			jQuery('#canvas').attr('data-id', detectingImg["data-id"]);
			toastr.success(`图片分析成功`);
			jQuery('.tools-up').css('display', 'block');
		},
		error: () => {
			toastr.error(`图片分析失败`);
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
function analysis(video, frame, leftX, leftY, rightX, rightY, index) {
	let xy = `${Math.round(leftX)}_${Math.round(leftY)}_${Math.round(rightX)}_${Math.round(rightY)}`;
	jQuery.ajax({
		url: "http://ailw.xianglu-china.com/vessel/imgAna",
		type: "get",
		dataType: 'JSON',
		data: { video, frame, xy },
		success: (res) => {
			console.log(res);
			setTimeout((video, frame, xy) => {
				getImgData(video, frame, xy, index)
			}, 5000, video, frame, xy)
		},
		error: () => {
			toastr.error(`第${index}个标注结果参数发送失败`);
		}
	})
}

/**
 * 3. 获取数据的接口
 * @param {*} video 
 * @param {*} frame 
 * @param {*} xy 
 */

function getImgData(video, frame, xy, index) {
	jQuery.ajax({
		url: "http://ailw.xianglu-china.com/vessel/getImgData",
		type: 'get',
		dataType: 'json',
		data: { video, frame, xy },
		success: function (data) {
			if (data.retCode === 0) {
				let d = Object.values(data);
				d.splice(d.length - 1, 1);
				annotate.Arrays.paramsArray.push(d);
				let memoryLen = annotate.Arrays.imageAnnotateMemory.length;
				let paramLen = annotate.Arrays.paramsArray.length;
				if (memoryLen === paramLen) {
					toastr.success(`所有参数获取成功`);
				}
			} else {
				setTimeout((video, frame, xy) => { getImgData(video, frame, xy) }, 5000, video, frame, xy);
			}
		},
		error: () => {
			toastr.error(`第${index}个标注结果参数获取失败`);
		}
	})
}
