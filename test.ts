class Empty {}

function fn(arg: Empty) {
  // 무엇인가를 하나요?
}

// 오류는 없지만, '빈' 타입은 아니지 않나요?
fn({ k: 10 });