let videoFrame = VideoFrame();
let video, output;
let scale = 1;
let isVideo = true;
let frameArr = [];
let button = document.getElementById('btn-picshot');
let initialize = function () {
  output = document.getElementById("screenShot");
  video = document.getElementById("video0");
  button.addEventListener('click', captureImage);
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
      divBtn.innerHTML = `
    <div class="anal-pic">自动检测</div>
    <div class="frame-pic">第${id}帧</div>
    <div class="del-pic">删除</div>
    `;

      let img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.dataset.id = id;
      img.className = "screenShotPic";
      div.appendChild(img);
      div.appendChild(divBtn);
      output.appendChild(div);
    } else {
      toastr.warning(`第${id}帧已存在`);
    }
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
  $('#canvas').css('display', 'none');
  $('.scaleBox').css('display', 'none');
  $('.featureList-video').css("display", "block");
  $('.videoEdit').css("display", "block");
  $('.commentResult').hide();
  $('.loading').hide();
	$('.tools-up').css('display', 'none');
};

let returnPic = () => {
  $('#canvas').css('display', 'block');
  $('.scaleBox').css('display', 'block');
  $('.featureList-video').css("display", "none");
  $('.videoEdit').css("display", "none");
  $('.commentResult').show();
	$('.tools-up').css('display', 'block');
}

$('#tools').on("click", ".returnVideo", function () {
  if (isVideo) {
    returnVideo();
  } else {
    returnPic();
  }
  isVideo = !isVideo;
})

initialize();

let objUrl=null;
$("#video").change(function () {
  console.log(objUrl);
  // if(objUrl) {
    
  // }
  objUrl = getObjectURL(this.files[0]);
  let name = this.files[0].name.split('.')[0];
  if (objUrl) {
    $('.pageName').text(name);
    $("#video0").attr("src", objUrl);
    $('#screenShot').html('');
    $('#data-loading').css('display', "block");
    $('.ins-arrow').hide();
    $('#video0').show();
    frameArr = [];
    
    // VideoAna("1.wmv");
  }
});

$("#screenShot").on("click", ".del-pic", function () {
  $($(this)[0].parentElement.parentElement).remove();
})

$('#screenShot').on('mousewheel DOMMouseScroll', onMouseScroll);

function onMouseScroll(e) {
  e.preventDefault();
  var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
  var delta = Math.max(-1, Math.min(1, wheel));
  let step = 50;
  if (delta < 0) {
    this.scrollLeft -= step;
  } else {
    this.scrollLeft += step;
  }
}


/**
 * 4. 血管动态分析
 * @param {*} video 
 */
function VideoAna(video) {
  $.ajax({
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
 * 5. 获取数据的接口
 * @param {*} video 
 */
function getVideoData(video) {
  $.ajax({
    url: "http://ailw.xianglu-china.com/vessel/getVideoData",
    type: 'get',
    dataType: 'json',
    data: { video },
    success: function (data) {
      if (data.retCode === 0) {
        $('#baiweishuan').text(data.baiweishuan);
        $("#speed").text(data.speed);
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
