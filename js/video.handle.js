let videoFrame = VideoFrame();
let video, output;
let scale = 1;
let isVideo = true;
let button = document.getElementById('btn-picshot');
let initialize = function () {
  output = document.getElementById("screenShot");
  video = document.getElementById("video0");
  button.addEventListener('click', captureImage);
};
let captureImage = function () {
  if (video.src) {
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
  <div class="del-pic">删除</div>
  `;

    let img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.dataset.id = videoFrame.get();
    img.className = "screenShotPic";
    div.appendChild(img);
    div.appendChild(divBtn);
    output.appendChild(div);
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
  $('.videoEdit').css("display", "block");
};

let returnPic = () => {
  $('#canvas').css('display', 'block');
  $('.scaleBox').css('display', 'block');
  $('.videoEdit').css("display", "none");
}

$('#tools').on("click", ".returnVideo", function () {
  if (isVideo) {
    returnVideo();
    isVideo = false;
  } else {
    returnPic();
    isVideo = true;
  }
})

initialize();

$("#video").change(function () {
  let objUrl = getObjectURL(this.files[0]);
  let name = this.files[0].name.split('.')[0];
  if (objUrl) {
    $('.returnVideo').css('display', 'block');
    returnVideo();
    $('.pageName').text(name);
    $("#video0").attr("src", objUrl);
    $('#screenShot').html('');
    $('.selectOperation').css('display', "none");
    $('#data-loading').css('display', "block");
    axiosData = [];
    numberData = [];
    averageData = [];
    VideoAna("1.wmv");
  }
});

$("#screenShot").on("click", ".del-pic", function () {
  $($(this)[0].parentElement.parentElement).remove();
})


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
      getVideoData(video);
    },
    error: () => {
      console.log("失败");
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
        console.log(res);
      } else if (data.retCode === 1) {
        setTimeout((video) => { getVideoData(video) }, 10000, video);
      }
    }
  })
}
