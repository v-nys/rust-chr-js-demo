var CHR = require('chr')             // load the module
var chr = CHR()                      // create new solver
    
// add the rule
chr('upto(Max), fib(A,AV), fib(B,BV) ==> \
       B === A+1, B < Max | fib(B+1,AV+BV)')

console.log(chr.Store.toString())    // print the content of the
                                     //   constraint store
/* results in:
    (empty)
*/

Promise.all([
  chr.fib(1,1),                      // the first Fibonacci is 1
  chr.fib(2,1)                       // the second is 1
]).then(function () {
  console.log(chr.Store.toString())  // both have been stored
  /* results in:
      ID  Constraint
      --  ----------
      1   fib(1,1)  
      2   fib(2,1)  
  */

  // now generate the Fibonaccis upto the 5th element
  chr.upto(5).then(function () {
    console.log(chr.Store.toString())
  })
  /* results in:
      ID  Constraint
      --  ----------
      1   fib(1,1)  
      2   fib(2,1)  
      3   upto(5)   
      4   fib(3,2)  
      5   fib(4,3)  
      6   fib(5,5)
  */
})
