

// // var container = ["orange", "bat", "mouse", "bird"];
// // // Assuming you have a variable named \"input\" that contains the value you want to check

// // if (container.includes(container[0])) {
    
// // } else {
    
// // }

// var emojiArray = ["😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚","😀","❤️", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "😬", "😰", "😱", "😳", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "😇", "🤠", "🤡", "🥳", "🥴", "🥺", "🤯", "🤪", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "💀", "☠️", "💩", "🤖", "🎃", "👻", "👽", "👾"];

// var emo = " ✌";

// if (emojiArray.includes(emo)) {
//   //console.log(emo + " is present in the emojiArray");
// } else {
//   console.log("hhhh");
// }







function generateOTP() {
          
    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
  
console.log("OTP of 6 digits: ")
console.log( generateOTP() );