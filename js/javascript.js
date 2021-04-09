//게임스토리 슬라이드
$(function () {
    const $slide = $('section>.gamestory>.slide>.slides');
    const $pagination = $('section>.gamestory>.slide>.pagination>li>a');
    const $txt = $('section>.gamestory>.txt>ol>li');
    const $btnStop = $('section>.gamestory>.slide>.slides_switch>.slides_pause');
    const $btnPlay = $('section>.gamestory>.slide>.slides_switch>.slides_play');

    let nowIdx = 0;
    let oldIdx = null;
    let intervalKey = null;

    const slideMoveFn = function () {
        $slide.stop().animate({
            left: -702 * nowIdx
        }, 600);

        $pagination.eq(nowIdx).parent().addClass('on').siblings().removeClass('on');

        $txt.eq(oldIdx).hide();
        $txt.eq(nowIdx).fadeIn(200);
    };

    const slideStopFn = function () {
        clearInterval(intervalKey);

        $btnPlay.show();
        $('.ball').animate({
            left: 32
        }, 500, function () {
            $btnStop.hide();
        });
    };


    $pagination.on('click', function (evt) {
        evt.preventDefault();
        slideStopFn();

        oldIdx = nowIdx;
        nowIdx = $pagination.index(this);

        slideMoveFn();
    });


    $(window).on('load', function () {
        intervalKey = setInterval(function () {
            oldIdx = nowIdx;

            if (nowIdx < 3) {
                nowIdx++;
            } else {
                nowIdx = 0;
            }

            slideMoveFn();
        }, 3000);

        $btnPlay.hide();

    });

    $btnStop.on('click', function (evt) {
        evt.preventDefault();
        slideStopFn();
    });

    $btnPlay.on('click', function (evt) {
        evt.preventDefault();

        $btnStop.show();

        $('.ball').animate({
            left: 2
        }, 500, function () {
            $btnPlay.hide();
        });

        clearInterval(intervalKey);
        intervalKey = setInterval(function () {
            oldIdx = nowIdx;

            if (nowIdx < 3) {
                nowIdx++;
            } else {
                nowIdx = 0;
            }

            slideMoveFn();
        }, 3000);

    });

});


//아래쪽 게임
$(function () {
    const $character = $('section>.game>.gamescreen>ul');
    const $dogs = $character.find('li');
    const $startBtn = $('section>.game>button');

    const $score = $('section>.game>.gamescreen>p');
    let score = 0;
    let intervalKey = null;
    let nowIdx = 0;

    const $progressBar = $('section>.game>progress');
    let intervalID = null;
    let val = 0;

    $dogs.hide();

    $dogs.on('click', function () {
        console.log('연결');

        nowIdx = $(this).index();
        console.log(nowIdx);

        if (nowIdx == 2) {
            score -= 100;
        } else {
            score += 100;
        }

        if (nowIdx == 0) {
            $(this).css({
                'background-image': 'url(./images/mino_happy.png)'
            });
        }

        if (nowIdx == 1) {
            $(this).css({
                width: 170,
                'background-image': 'url(./images/cream_happy.png)',
                'background-size': 'contain'
            });
        }

        if (nowIdx == 2) {
            $(this).css({
                width: 180,
                'background-image': 'url(./images/jack_happy.png)',
                'background-size': 'cover'
            });
        }

        $score.text(score + "점");
    });

    $dogs.on('mouseenter', function () {
        $(this).css({
            cursor: 'url(./images/cursor.cur), crosshair'
        });

        nowIdx = $dogs.index(this);

        if (nowIdx == 0) {
            $dogs.eq(nowIdx).css({ 'background-image': 'url(./images/mino_want.png)' });
        }

        if (nowIdx == 1) {
            $dogs.eq(nowIdx).css({ 'background-image': 'url(./images/cream_want.png)' });
        }

    });

    const progressFn = function () {
        intervalID = setInterval(function () {
            $progressBar.attr({
                value: val++
            });
        }, 140);
    };

    const characterMoveFn = function () {
        intervalKey = setInterval(function () {
            const num = Math.floor(Math.random() * 6);
            const ranNum = Math.floor(Math.random() * 3);

            const coordX = [850, 250, 600, 1000, 350, 800];
            const coordY = [15, 125, 155, 225, 255, 285];

            // console.log('위치 숫자 :' , num);
            // console.log('이미지 숫자 : ', ranNum);
            // console.log('left :' , coordX[num]);
            // console.log('bottom : ', coordY[num]);

            $dogs.eq(0).css({ 'background-image': 'url(./images/mino_sad.png)' });
            $dogs.eq(1).css({ 'background-image': 'url(./images/cream_sad.png)' });
            $dogs.eq(2).css({
                'background-image': 'url(./images/jack_cheat.png)',
                'background-size': 'contain'
            });

            if (num == 0 || num == 1) {
                $character.css({
                    'z-index': 950
                });
            }

            if (num == 2 || num == 3) {
                $character.css({
                    'z-index': 850
                });
            }

            if (num == 4 || num == 5) {
                $character.css({
                    'z-index': 750
                });
            }

            $character.css({
                left: coordX[num],
                bottom: coordY[num]
            }).find('li').eq(ranNum).show().stop().animate({
                top: '-210'
            }, 950).animate({
                top: '30'
            }, 450);

        }, 1400);
    };


    $startBtn.on('click', function () {
        //한번만 클릭되도록
        if ($startBtn.hasClass('start')) {
            $startBtn.removeClass('start');

            $('#intrigue').hide();
            $('section>.game>button').hide();
            clearInterval(intervalKey);
            progressFn(); //프로그래스 바 14초 동안 움직임 - 100까지 도달하면 멈춤
            characterMoveFn(); //캐릭터 움직임

            setTimeout(function () {
                clearInterval(intervalKey);
                $dogs.hide();
                $('section>.lightbox').show();
                $('section>.lightbox>#pop_score>p').text(score);
                $('body').css({ 'overflow-y': 'hidden' });
            }, 14000); //14초 후 정지
        }
    });

    //닫는 방법 여러가지들
    $('section>.lightbox>#pop_score>button').on('click', function () {
        $('section>.lightbox').hide();
        location.reload();
        $(window).scrollTop(0);
    });

    $(document).on('keyup', function (evt) {
        if (evt.which === 27) {
            $('section>.lightbox').hide();
            location.reload();
            $(window).scrollTop(0);
        }
    });

    //쇼핑몰 바로가기 버튼 - 새로고침
    $('section>.lightbox>#pop_score>.shop').on('click', function (evt) {
        evt.preventDefault();

        $('section>.lightbox').hide();
        location.reload();
        $(window).scrollTop(0);
    });

});

//게임화면 시작 전 움직이는 이미지
$(function(){    
    const $play = $('.play>img')
    
    let intervalKey = null;
    let num =1;

    $(window).on('load',function(){
        
        clearInterval(intervalKey);
    
        intervalKey = setInterval(function(){
            if(num<9){
                num++;
            }else{
                num=1;
            }    

            $play.attr({
                src : './images/play_'+num+'.jpg'
            });

        },1000);
    
    });
    
});