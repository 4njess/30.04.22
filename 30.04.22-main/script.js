const game = {
    height: 198 * .61834,
    width: 320 * .61834,
    matrix: 4,
    firstCard: null,
    failCount: 0,
    cards: [],
    getCardById: (cards, cardId) => {
        let card = null;
        cards.map(c => {
            if (c.id === cardId) {
                card = c;
            }
        });
        return card;
    },
    setIsShowTrueCards: (cards, arrayCardId) => {
        cards.map(c => {
            for (let i = 0; i < arrayCardId.length; i++) {
                const cardId = arrayCardId[i];
                if (c.id === cardId) {
                    c.isShow = true;
                }
            }
        });
    },
    isFinish: (cards) => {
        let isFinish = true;
        cards.map(c => {
            if (!c.isShow) {
                isFinish = false;
            }
        });
        return isFinish;
    }
}

game.cards = generateCards(game.matrix);

function generateCards(matrix) {
    const colors = [];
    const countColors = (matrix * matrix) / 2;

    for (let i = 0; i < countColors; i++) {
        const color = randomColorRGB();
        colors.push(color);
        colors.push(color);
    }

    const cards = [];
    for (let i = 0; i < colors.length; i++) {
        const card = {
            id: i,
            color: colors[i],
            isShow: false
        }
        cards.push(card);
    }

    for (let i = 0; i < 64; i++) {
        cards.sort(() => Math.random() - 0.5);
    }

    console.log(cards);
    return cards;
}

function sortArray(array) {
    for (let i = 0; i < 64; i++) {
        array.sort(() => Math.random() - 0.5);
    }
    return array;
}

function randomColorRGB() {
    return 'rgb(' + 
    randomNumber(0, 255) + ', ' + 
    randomNumber(0, 255) + ', ' + 
    randomNumber(0, 255) + ')';
}

function randomNumber(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

$(document).ready(function () {

    $("#root")
    .html("<div class='matrix'></div>");
    $(".matrix")
    .width((game.width + 24) * game.matrix)
    .height((game.height + 24) * game.matrix);

    for (let i = 0; i < game.cards.length; i++) {
        const e = game.cards[i];
        $(".matrix")
        .append("<div id='cube_" + e.id + "'class ='cube'></div>");

        $("#cube_" + e.id).css({
            "width": game.width,
            "height": game.height,
            "background-color": '#1A1A1A',
            "cursor": "pointer",
        });
    }

    for (let i = 0; i < game.cards.length; i++) {
        const e = game.cards[i];
        $("#cube_" + e.id).click(function () {
            const id = $("#cube_" + e.id).attr('id');

            $("#cube_" + e.id).css({
                "background-color": e.color,
                "cursor": 'default'
            });

            const card = game.getCardById(
                game.cards, 
                Number(id.replace('cube_', ''))
            );

            console.log(card);
            if (!card.isShow) {
                if (!game.firstCard ||
                    (!!game.firstCard && 
                        game.firstCard.id !== card.id)) {
                    if (!game.firstCard) {
                        console.log('Запись первой');
                        game.firstCard = card;
                    } else if (!!game.firstCard) {
                        if (game.firstCard.color === card.color) {
                            // Есть совпадение.
                            console.log('Есть совпадение');
                            game.setIsShowTrueCards(
                                game.cards,
                                [
                                    game.firstCard.id,
                                    card.id
                                ]
                            );
                            game.firstCard = null;
                        } else {
                            // Нет совпадение.
                            console.log('Нет совпадение');
                            setTimeout(() => {
                                hideCard(game.firstCard.id);
                                hideCard(card.id);
                                game.firstCard = null;
                            }, 500);
                            game.failCount += 1;
                        }
                    }
                }
            }

            showResult();
        });
    }

    $("#root").append("<div id='result'></div>");
    showResult();

    function hideCard(cardId) {
        $("#cube_" + cardId).css({
            "background-color": '#1A1A1A',
            "cursor": 'pointer'
        });
    }

    function showResult() {
        $("#result").text(
            'Неудачных попыток:'
            + game.failCount
            + ', '
            + (game.isFinish(game.cards) 
            ? 'игра завершена.'
            : 'игра продолжается.')
        );
    }
});