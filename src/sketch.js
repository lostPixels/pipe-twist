import Random from './ab-random';

let PRODUCTION = process.env.NODE_ENV === 'production';

window.setup = () => {

    if (tokenData.hash) {
        const R = new Random();
        let randomSeedValue = R.random_dec() * 100000000000000000;
        randomSeed(randomSeedValue);
        noiseSeed(randomSeedValue);
    }

    if (!PRODUCTION) {
        console.log(`Random Seed: ${tokenData.hash}`);
    }

    createCanvas(1000, 600);
}

window.draw = () => {
    background(255)
    noFill();

    let circles = packCircles();
    circles.forEach(circle => {
        stroke('purple');
        strokeWeight(1);
        ellipse(circle.x, circle.y, circle.r * 2);
    });

    const thread = threadCircles(circles);

    noLoop();
}

const threadCircles = circles => {
    let start = findCircleAtPosition(circles, 'top');
    let end = findCircleAtPosition(circles, 'bottom');
    let candidates = circles.filter(c => c.ID !== start.ID && c.ID !== end.ID);
    //candidates = shuffleArray(candidates);
    candidates = [start, ...candidates, end]

    console.log(candidates)

    stroke(200)
    beginShape();
    candidates.forEach(c => {
        vertex(c.x, c.y);
    });
    endShape();

    stroke('red');

    beginShape();
    let length = candidates.length;
    for (let i = 0; i < length; i++) {
        let c1 = candidates[i];
        let c2 = candidates[(i + 1) % length];
        let c3 = candidates[(i + 2) % length];
        let angle = atan2(c2.y - c1.y, c2.x - c1.x);
        let angleNext = atan2(c3.y - c2.y, c3.x - c2.x);

        let oS1 = HALF_PI;
        let oS2 = -HALF_PI;

        let radius1 = c1.r + 5;
        let radius2 = c2.r + 5;
        let x1 = c1.x + cos(angle + oS1) * radius1;
        let y1 = c1.y + sin(angle + oS1) * radius1;
        let x2 = c2.x - cos(angle + oS2) * radius2;
        let y2 = c2.y - sin(angle + oS2) * radius2;

        vertex(x1, y1);
        vertex(x2, y2);

        for (let j = 0; j <= 32; j++) {
            let t = j / 32;
            let tAngle;
            if (angle < angleNext) {
                console.log(angle, angleNext)
                tAngle = lerpAngle(angle, angleNext, t, 'ccw') + PI / 2
                //tAngle = lerpAngle(angle, angleNext, t) + PI / 2
                fill('blue');
                circle(c2.x + cos(tAngle) * radius2, c2.y + sin(tAngle) * radius2, 5);
                noFill();
            }
            else {
                tAngle = lerpAngle(angle, angleNext, t) + PI / 2
            }


            let x = c2.x + cos(tAngle) * radius2;
            let y = c2.y + sin(tAngle) * radius2;
            vertex(x, y);
        }
    }
    endShape();
}

//Angle is in radians. Always rotate clockwise
const lerpAngle = (angle1, angle2, t, direction = 'ccw') => {
    let delta = angle2 - angle1;
    if (direction === 'cw') {
        if (delta < 0) {
            delta += TWO_PI;
        }
    }
    else {
        if (delta > 0) {
            delta -= TWO_PI;
        }
    }
    return angle1 + delta * t;
}


const packCircles = () => {
    let circles = [];
    let potentialPoints = [];
    for (let x = 100; x < 500; x += 100) {
        for (let y = 100; y < 500; y += 100) {
            potentialPoints.push({ x, y });
        }
    }
    for (let i = 0; i < 5; i++) {
        let point = random(potentialPoints);
        circles.push({
            x: point.x,
            y: point.y,
            r: random([25, 50]),
            ID: Symbol()
        });
    }
    return circles;
}

const findCircleAtPosition = (circles, position) => {
    let res = [];
    if (position === 'top') {
        res = circles.reduce((a, b) => a.y < b.y ? a : b);
    }
    if (position === 'bottom') {
        res = circles.reduce((a, b) => a.y > b.y ? a : b);
    }
    return res;
}

const shuffleArray = array => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = floor(random(currentIndex));
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}