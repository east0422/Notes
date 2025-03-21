/** Promise */
// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve("成功！");
//     reject('失败！')
//   }, 1000);
// });
// promise.then((result) => {
//   console.log('success', result); // 输出: 成功！
// }).catch((error) => {
//   console.log('error:', error);
// }).finally(() => {
//   console.log("完成！");
// });


/** race, 第一个完成resolve则执行then,第一个reject则执行catch */
// const promise1 = new Promise((resolve, reject) => setTimeout(resolve, 500, "500ms"));
// const promise2 = new Promise((resolve, reject) => setTimeout(reject, 1000, "1000ms"));
// Promise.race([promise1, promise2])
// .then((result) => {
//   console.log('success:', result); // 输出: "500ms"
// }).catch((error) => {
//   console.log('error:', error);
// }).finally(() => {
//   console.log('finally');
// });


/** allSettled 总是执行then不会执行catch */
// const promise1 = new Promise((resolve, reject) => setTimeout(reject, 500, "500ms"));
// const promise2 = new Promise((resolve, reject) => setTimeout(reject, 1000, "1000ms"));
// Promise.allSettled([promise1, promise2])
// .then((result) => {
//   console.log('success:', result); // 输出: success: [{ status: 'rejected', reason: '500ms' },{ status: 'rejected', reason: '1000ms' }]
// }).finally(() => {
//   console.log('finally');
// });

/** all 所有resolve才会执行then，只要有一个rejected就会执行catch */
// const promise1 = Promise.resolve("成功1");
// const promise2 = Promise.resolve("成功2");
// const promise3 = Promise.resolve("成功3");
// const promise4 = Promise.reject("失败4");
// Promise.all([promise1, promise2, promise3, promise4])
// .then((results) => {
//   console.log('results:', results); // 输出: ["成功1", "成功2", "成功3"]
// }).catch((error) => {
//   console.log('error:', error); // 输出: 失败4
// }).finally(() => {
//   console.log('finally');
// });