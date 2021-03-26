let videoFrame = VideoFrame();
let video, output;
let scale = 1.2;
let isVideo = true;
let initialize = function () {
  output = document.getElementById("screenShot");
  video = document.getElementById("video0");
  video.addEventListener('click', captureImage);
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
  $('.scaleParams').hide();
};

let returnPic = () => {
  $('#canvas').css('display', 'block');
  $('.scaleBox').css('display', 'block');
  $('.videoEdit').css("display", "none");
  $('.scaleParams').show();
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
let axiosData = [];
let numberData = [];
let averageData = [];
/**
* 3. 血管动态分析
* @param {*} videoID 
*/
function dynamicDetecting(videoID) {
  $.ajax({
    url: "http://127.0.0.1:3000/video/dynamicdetecting",
    type: "get",
    dataType: 'JSON',
    data: { videoID },
    success: (res) => {
      res.data.forEach(e => {
        axiosData.push(e[0]);
        numberData.push(e[1]);
        averageData.push(e[2]);
      });
      $('#data-loading').css('display', "none");
      drawChat();
    },
    error: () => {
      console.log("失败");
    }
  })
}

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
    dynamicDetecting(name)
  }
});

$("#screenShot").on("click", ".del-pic", function () {
  $($(this)[0].parentElement.parentElement).remove();
})

function drawChat() {
  var chartDom = document.getElementById('picPre');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    title: {
      text: '结果区'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['邮件营销', '联盟广告']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: axiosData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '流速白微栓',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: numberData
      },
      {
        name: '参数平均值',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: averageData
      },
    ]
  };

  option && myChart.setOption(option);
}