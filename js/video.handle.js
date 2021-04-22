let videoFrame = VideoFrame();
let video, output;
let scale = 1;
let isVideo = true;
let frameArr = [];
let buttonShot = document.getElementById('btn-picshot');
let initialize = function () {
  output = document.getElementById("screenShot");
  video = document.getElementById("video0");
  buttonShot.addEventListener('click', captureImage);
};
let captureImage = function () {
  let id = videoFrame.get();
  if (video.src) {
    if (!frameArr.includes(id)) {
      frameArr.push(id);
      let canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let div = document.createElement("div");
      div.className = "pic-item";
      let divBtn = document.createElement("div");
      divBtn.className = "div-Btm"
      divBtn.innerHTML = `<div class="anal-pic">自动检测</div><div class="frame-pic">第${id}帧</div><div class="del-pic">删除</div>`;
      let img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.dataset.id = id;
      img.className = "screenShotPic";
      img.width = video.videoWidth;
      img.height = video.videoHeight;
      div.appendChild(img);
      div.appendChild(divBtn);
      output.appendChild(div);
    } else {
      toastr.warning(`第${id}帧已存在`);
    }
  } else {
    toastr.warning("请导入视频");
  }
};

let getObjectURL = (file) => {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

let returnVideo = () => {
  jQuery('#canvas').css('display', 'none');
  jQuery('.scaleBox').css('display', 'none');
  jQuery('.featureList-video').css("display", "block");
  jQuery('.videoEdit').css("display", "block");
  jQuery('.commentResult').hide();
  jQuery('.loading').hide();
  jQuery('.tools-up').css('display', 'none');
};

let returnPic = () => {
  jQuery('#canvas').css('display', 'block');
  jQuery('.scaleBox').css('display', 'block');
  jQuery('.featureList-video').css("display", "none");
  jQuery('.videoEdit').css("display", "none");
  jQuery('.commentResult').show();
  jQuery('.tools-up').css('display', 'block');
}

jQuery('#tools').on("click", ".returnVideo", function () {
  if (isVideo) {
    returnVideo();
  } else {
    returnPic();
  }
  isVideo = !isVideo;
})

initialize();

let objUrl = null;
jQuery("#video").change(function () {
  console.log(objUrl);
  // if(objUrl) {

  // }
  objUrl = getObjectURL(this.files[0]);
  let name = this.files[0].name.split('.')[0];
  if (objUrl) {
    annotate.Nodes.video = name;
    jQuery("#video0").attr("src", objUrl);
    jQuery('#screenShot').html('');
    jQuery('#data-loading').css('display', "block");
    jQuery('.ins-arrow').hide();
    jQuery('#video0').show();
    frameArr = [];
    jQuery('#spwjid').val(name);  // 视频id
    jQuery("#jcsj").val(getNowFormatTime(new Date())); // 检查时间

    jQuery("#dtcs").val("可就是东方航空圣诞节和付款2398747298{}");   // 动态参数

    // 单图片参数
    jQuery("#spwjid01").val("[{\"tpid\":\"121\", \"xgcspjz\":\"血管参数平均值\", \"dtpzdbg\":\"诊断报告\",\"dftpdxgfxList\":[{\"xgwzzsj\":\"xgwzzsj\", \"xgwzyxjzb\":\"xgwzyxjzb\", \"cszfc\":\"cszfc\"}]}]")

    // VideoAna("1.wmv");
  }
}); 

function getNowFormatTime() {
  var nowDate = new Date();
  var colon = ":";
  var h = nowDate.getHours();
  var m = nowDate.getMinutes();
  var s = nowDate.getSeconds();
  //补全0，并拼接
  return getNowFormatDay(nowDate) + " " + completeDate(h) + colon + completeDate(m) + colon + completeDate(s);
}

function getNowFormatDay(nowDate) {
  var char = "-";
  if (nowDate == null) {
    nowDate = new Date();
  }
  var day = nowDate.getDate();
  var month = nowDate.getMonth() + 1;//注意月份需要+1
  var year = nowDate.getFullYear();
  //补全0，并拼接
  return year + char + completeDate(month) + char + completeDate(day);
}

function completeDate(value) {
  return value < 10 ? "0" + value : value;
}

jQuery("#screenShot").on("click", ".del-pic", function () {
  jQuery(jQuery(this)[0].parentElement.parentElement).remove();
  let key = jQuery(this).parent().prev()[0].attributes[1].value;
  frameArr = frameArr.filter(v => v !== parseInt(key))
})

/**
 * 血管动态分析
 * @param {*} video 
 */
function VideoAna(video) {
  jQuery.ajax({
    url: "http://ailw.xianglu-china.com/vessel/videoAna",
    type: "get",
    dataType: 'JSON',
    data: { video },
    success: (res) => {
      console.log(res);
      toastr.success(`视频发送成功，正在分析，请稍等`);
      setTimeout((video) => { getVideoData(video) }, 10000, video);
    },
    error: () => {
      toastr.error(`图片发送失败`);
    }
  })
}

/**
 * 获取数据的接口
 * @param {*} video 
 */
function getVideoData(video) {
  jQuery.ajax({
    url: "http://ailw.xianglu-china.com/vessel/getVideoData",
    type: 'get',
    dataType: 'json',
    data: { video },
    success: function (data) {
      if (data.retCode === 0) {
        jQuery('#baiweishuan').text(data.baiweishuan);
        jQuery("#speed").text(data.speed);
        toastr.success(`视频参数获取成功`);
      } else if (data.retCode === 1) {
        setTimeout((video) => { getVideoData(video) }, 10000, video);
      }
    },
    error: function (err) {
      toastr.error(`视频参数获取失败`);
    }
  })
}

/** 
 * 手风琴展示
*/
jQuery('#article-parent header').click(function () {
  jQuery(this).parent().find('.two_div').slideDown();
  jQuery(this).parent().siblings('article').find('.two_div').slideUp();
});