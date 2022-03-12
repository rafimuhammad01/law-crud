import app from "./app";

let PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    return console.log('Server is running in port: ', PORT);
})