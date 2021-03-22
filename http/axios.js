







/**
 * 5. 结果保存
 * @param {*} params 
 */
async function saveResult(params) {
  axios({
    method: 'POST',
    url: '/',
    data: {
      userID: params.userID,
      videoID: params.videoID,
      picID: params.picID,
      eachParam: params.eachParam,
      averageParam: params.averageParam,
      report: params.report,
    }
  })
    .then(response => {
      console.log('/a', response.data)
      return response.data
    }, error => {
      console.log('错误', error.message)
    })
}


/**
 * 6. 历史查询列表
 * @param {*} params 
 */
async function searchHistory(params) {

  let url = params.userID ? params.userID : params.start + params.end;
  return axios.get('').then(res => {

  })
    .catch(err => {
      console.log(err);
    })
}


/**
 * 7. 历史查询明细
 * @param {*} videoID 
 * @param {*} picID 
 */
async function searchHistoryDetails(videoID, picID) {
  return axios.get('').then(res => {

  })
    .catch(err => {
      console.log(err);
    })
}

