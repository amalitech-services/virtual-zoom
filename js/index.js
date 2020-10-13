import { ZoomMtg } from "@zoomus/websdk";

console.log("checkSystemRequirements");
console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "iLMBW2P1TviW-u0j3wk_7A";


const API_SECRET = "W3du7DDqsj0fEj2NX9RrQxgBbXiIOFHsCwmo";

testTool = window.testTool;
// var display_name = "Jebo"
// var meeting_number = "96062763265"
// var meeting_pwd = "ahkvirtual"
// var meeting_lang = "English"
var signature = ""
testTool.setCookie(
  "display_name",
  display_name
)
testTool.setCookie(
  "meeting_lang",
  meeting_lang
)
testTool.setCookie("meeting_pwd", meeting_pwd)
testTool.setCookie(
  "meeting_number",
   meeting_number
)


$( document ).ready( function(e) {
  // e.preventDefault()
  const meetingConfig = testTool.getMeetingConfig()
  //get url parameters
  var params = window.location.search
  const urlParams = new URLSearchParams(params)
  meetingConfig.mn = urlParams.get('meetingNumber')
  meetingConfig.nm = urlParams.get('name')
  meetingConfig.userName = urlParams.get('name')
  meetingConfig.role = 0
  meetingConfig.pwd = urlParams.get('password')
  meetingConfig.leaveUrl = urlParams.get('leaveUrl')

  console.log(meetingConfig)
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  testTool.setCookie("meeting_number", meetingConfig.mn);
  testTool.setCookie("meeting_pwd", meetingConfig.pwd);

  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: 0,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      // signature = re.result
      meetingConfig.apiKey = API_KEY;
      const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
      console.log(joinUrl);     
      window.location = joinUrl
    },
  });
});

// click copy jon link button
window.copyJoinLink = function (element) {
  const meetingConfig = testTool.getMeetingConfig()
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      meetingConfig.apiKey = API_KEY;
      const joinUrl =
        testTool.getCurrentDomain() +
        "/meeting.html?" +
        testTool.serialize(meetingConfig);
      $(element).attr("link", joinUrl);
      const $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(element).attr("link")).select();
      document.execCommand("copy");
      $temp.remove();
    },
  });
};

