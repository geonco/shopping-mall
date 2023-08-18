$(document).ready(function () {
    $.ajax({
        url: 'store.json',
        dataType: 'json',
        success: function (data) {
            
            // 카드 만들기
            for (var i = 0; i < data.products.length; i++) {
                var 템플릿 =
                    `<div draggable="true" class="card" style="width: 14rem;" data-id="${data.products[i].id}">
                    <img src="img/${data.products[i].photo}" class="card-img-top" width="100%" height="150px" draggable="false";>
                    <div class="card-body">
                        <h5 class="card-title">${data.products[i].title}</h5>
                        <span>${data.products[i].brand}</span>
                        <p>가격 : ${data.products[i].price}</p>
                        <a href="#" class="btn btn-dark put">담기</a>
                    </div>
                </div>`
                $('.card-bg').append(템플릿);
            }

            // <input>에 검색어를 입력하여 그 글자가 제목, 업체명에 들어있으면 그 상품만 보여주기
            $('input').on('input', function () {
                $('.card-bg').html('');
                for (var i = 0; i < data.products.length; i++) {
                    if (data.products[i].title.includes($('input').val()) || data.products[i].brand.includes($('input').val())) {

                        // 해당되는 제품명, 브랜드명에 노란색 배경 주기
                        var titleYellow = data.products[i].title;
                        titleYellow = titleYellow.replace($('input').val(), `<span style="background: yellow">${$('input').val()}</span>`);
                        var brandYellow = data.products[i].brand;
                        brandYellow = brandYellow.replace($('input').val(), `<span style="background: yellow">${$('input').val()}</span>`);

                        // 템플릿 재정의
                        var 템플릿 =
                            `<div draggable="true" class="card" style="width: 14rem;" data-id="${data.products[i].id}">
                            <img src="img/${data.products[i].photo}" class="card-img-top" width="100%" height="150px" draggable="false";>
                            <div class="card-body">
                                <h5 class="card-title">${titleYellow}</h5>
                                <span>${brandYellow}</span>
                                <p>가격 : ${data.products[i].price}</p>
                                <a href="#" class="btn btn-dark put">담기</a>
                            </div>
                        </div>`
                        $('.card-bg').append(템플릿);
                    }
                }
            });
            // drag 시작
            $('.card').on('dragstart', function (e) {
                e.originalEvent.dataTransfer.setData('id', e.target.dataset.id);
                console.log('dragstart');
            });

            // drag 진행중
            $('.black-bg').on('dragover', function (e) {
                e.preventDefault();
                console.log('dragover');
            });

            var count = 1;  // 장바구니에 카드가 있는지 없는지 체크하기 위해 설정

            // drop 됐을 때
            $('.black-bg').on('drop', function (e) {

                let productId = e.originalEvent.dataTransfer.getData('id'); // 비밀정보 가져오기

                $('.여기로드래그').remove();

                // 카드 템플릿
                var card =
                    `<div draggable="true" class="card" style="width: 14rem;" data-id="${productId}">
                        ${$('.card').eq(productId).html()}
                    </div>`

                // 장바구니에 카드가 아무것도 없을 때
                if (count == 1) {
                    var card = card.replace('<a href="#" class="btn btn-dark put">담기</a>', '<input value="1" class="count">');
                    $('.black-bg').append(card);
                    count++;
                }

                // 장바구니에 카드가 있을 때
                else {
                    var title = $('.card-title').eq(productId).html();  // 제목 추출

                    var len = $('.black-bg').children().length;     // 장바구니에 들어있는 카드의 개수

                    var isDuplicate = false;    // 중복 여부를 확인하기 위한 변수
                    var insertIndex = 0;    // 상품을 삽입할 위치

                    for (var i = 0; i < len; i++) {
                        // 누른 버튼의 title과 장바구니에 있던 카드의 title이 같을 때 
                        if (title == $('.black-bg').children().eq(i).children('.card-body').children('h5').html()) {
                            isDuplicate = true;
                            insertIndex = i;
                            break;
                        }
                    }

                    // 중복된 카드가 있을 때
                    if (isDuplicate) {

                        // input value를 숫자로 바꾼 후 value값을 +1 한다.
                        var new_val = parseInt($('.count').eq(insertIndex).val());
                        new_val++;

                        $('.black-bg').children().eq(insertIndex).children('.card-body').children('input').val(new_val);    // 장바구니에 있는 해당되는 카드의 val 값을 변경
                    }

                    // 중복된 카드가 없을 때
                    else {
                        var card = card.replace('<a href="#" class="btn btn-dark put">담기</a>', '<input value="1" class="count">');    // 장바구니에 그 카드가 없으므로 input value를 1로 변경

                        $('.black-bg').append(card);    // 장바구니에 추가
                    }
                }
                $('.price-bg').removeClass('hide'); // 최종가격 창 보여주기

                최종가격(); // 최종가격 보여주기
            });



            // 담기 버튼 클릭했을 때
            $('.put').on('click', function (e) {

                $('.여기로드래그').remove();

                // 카드 템플릿
                var card =
                    `<div draggable="true" class="card" style="width: 14rem;">
                        ${$(e.target.parentElement.parentElement).html()}
                    </div>`

                // 장바구니에 카드가 아무것도 없을 때
                if (count == 1) {
                    var card = card.replace('<a href="#" class="btn btn-dark put">담기</a>', '<input value="1" class="count">');
                    $('.black-bg').append(card);
                    count++;
                }

                // 장바구니에 카드가 있을 때
                else {
                    var title = $(e.target).siblings('h5').html();  // 제목 추출

                    var len = $('.black-bg').children().length;     // 장바구니에 들어있는 카드의 개수

                    var isDuplicate = false;    // 중복 여부를 확인하기 위한 변수
                    var insertIndex = 0;    // 상품을 삽입할 위치

                    for (var i = 0; i < len; i++) {

                        // 누른 버튼의 title과 장바구니에 있던 카드의 title이 같을 때 
                        if (title == $('.black-bg').children().eq(i).children('.card-body').children('h5').html()) {
                            isDuplicate = true;
                            insertIndex = i;
                            break;
                        }
                    }

                    // 중복된 카드가 있을 때
                    if (isDuplicate) {

                        // input value를 숫자로 바꾼 후 value값을 +1 한다.
                        var new_val = parseInt($('.count').eq(insertIndex).val());
                        new_val++;

                        $('.black-bg').children().eq(insertIndex).children('.card-body').children('input').val(new_val);    // 장바구니에 있는 해당되는 카드의 val 값을 변경
                        // $('.black-bg').children().eq(insertIndex).children('.card-body').children('input').attr("value", new_val);    // 장바구니에 있는 해당되는 카드의 val 값을 변경
                    }

                    // 중복된 카드가 없을 때
                    else {
                        var card = card.replace('<a href="#" class="btn btn-dark put">담기</a>', '<input value="1" class="count">');    // 장바구니에 그 카드가 없으므로 input value를 1로 변경

                        $('.black-bg').append(card);    // 장바구니에 추가
                    }
                }
                $('.price-bg').removeClass('hide'); // 최종가격 창 보여주기

                최종가격(); // 최종가격 보여주기
            });

            // 수량 건드렸을 때 최종가격 출력
            $('.black-bg').on('input', function () {
                최종가격(); // 최종가격 보여주기
            });

            // 장바구니 총가격 보여주기
            function 최종가격() {
                var 최종가격 = 0;

                for (var i = 0; i < $('.count').length; i++) {
                    최종가격 = 최종가격 + parseInt($('.count').eq(i).siblings('p').html().substring(5)) * $('.count').eq(i).val();  // 장바구니에 있는 카드의 수량과 가격을 곱해 최종가격에 더해준다.
                }

                $('.total-price').html(`합계 : ${최종가격}원`); // 최종가격 표시
            }

            // 구매하기 버튼 눌렀을 때
            $('.buy').click(function () {
                $('.bg-b').addClass('show-bg');
                $('.bg-w').addClass('show-bg');
            });

            // 성함, 연락처 입력했을 때
            var name = '';
            var phoneNum = '';

            $('.name').on('input', function () {
                name = $('.name').val();
                console.log(name);
            });

            $('.phoneNum').on('input', function () {
                phoneNum = $('.phoneNum').val();
                console.log(phoneNum);
            });


            // 닫기 버튼 눌렀을 때
            $('.close').click(function () {
                $('.bg-b').removeClass('show-bg');
                $('.bg-w').removeClass('show-bg');
            });

            // 입력 완료 버튼 눌렀을 때
            $('.btn-primary').click(function(){
                $('#canvas').removeClass('hide');
                $('.bg-b').removeClass('show-bg');
                $('.bg-w').removeClass('show-bg');
                
                // 영수증 목록 보여주기
                영수증목록();
            });

            // 영수증 이미지
            var canvas = document.getElementById('canvas');
            var c = canvas.getContext('2d');
            
            // 상단
            c.fillStyle = "lightgray";
            c.fillRect(3, 5, 693, 50);
            
            // 영수증 content
            c.fillStyle = 'black';
            c.font = '25px Arial';
            c.fillText('영수증', 20, 90);
            
            c.font = '16px Arial';
            c.fillText(new Date(), 24, 130);

            // 닫기 버튼 감싸는 박스
            c.fillStyle = 'lightgrey';
            c.fillRect(610, 750, 60, 40);
            
            // 닫기 버튼 텍스트 설정
            c.fillStyle = 'black';
            c.font = '18px Arial';
            c.fillText('닫기', 622, 778);

            // 닫기 버튼 클릭시
            canvas.addEventListener('click', function(e) {
                var rect = canvas.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                if (x >= 610 && x <= 670 && y >= 750 && y <= 790) {
                    // 버튼 클릭 시 동작
                    $('#canvas').addClass('hide');
                }
            });

            // 영수증 목록 보여주는 함수
            function 영수증목록() {
                
                // 목록 위치 지정
                var translateX = 24;
                var translateY = 180;

                for (var i=0; i<$('.count').length; i++) {
                    var cardTitle = $('.count').eq(i).siblings('h5').html();
                    var cardBrand = $('.count').eq(i).siblings('span').html();
                    var cardPrice = $('.count').eq(i).siblings('p').html();
                    var cardCount = $('.count').eq(i).val();
                    var cardTotalPrice = parseInt(cardPrice.substring(5)) * parseInt(cardCount);

                    c.font = '16px Arial';
                    c.fillText(cardTitle, translateX, translateY);
                    c.fillText(cardBrand, translateX, translateY+30);
                    c.fillText(cardPrice, translateX, translateY+60);
                    c.fillText(`수량 : ${cardCount}`, translateX, translateY+90);
                    c.fillText(`합계 : ${cardTotalPrice}`, translateX, translateY+120);

                    translateY = translateY + 200;

                    // 목록이 영수증 크기 넘어설 때 위치 조정
                    if (translateY == 780) {
                        translateX = translateX + 300;
                        translateY = 180;
                    }
                }

                c.fillText(`총 합계 : ${$('.total-price').html().substring(5)}`, 500, 700);
            }
        }
    });
});
