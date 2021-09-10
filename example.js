const x = {
    name: "hnam",
    age: 3
}
const result = [];
const y = Object.keys(x).map((key) => {
    return {
        name: key,
        value: x[key]
    }
});
Object.keys(x).forEach(key => {
    result.push({
        name: key,
        value: x[key]
    })
})
console.log(y);
