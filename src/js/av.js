var APP_ID = 'K0wb1RHVOKpsF781QB7RaYTL-gzGzoHsz';
var APP_KEY = 'uHwy0anV4iGqDtsN1XOnAnzM';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
var TestObject = AV.Object.extend('Song');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!'
 })//.then(function(object) {
//   alert('LeanCloud Rocks!');
// })