/*
** VIC-TEAM, 2019
** AlexOTime Source Bot
** par Imnibis
** Ce bot cite la source de chacun des tweets d'AlexOTime
*/
console.log(".----------------------------------------------------------------------------.");
console.log("| ####  ##### #   # ####   ####    #   #  ###  ####   ###  ##### #   # ##### |");
console.log("| #   # #     ##  # #   # #        #   # #   # #   # #   # #     ##  #   #   |");
console.log("| ####  ####  # # # #   #  ###     #     ##### ####  #     ####  # # #   #   |");
console.log("| #   # #     #  ## #   #     #    #     #   # #   # #  ## #     #  ##   #   |");
console.log("| #   # ##### #   # ####  ####     ####  #   # #   #  ###  ##### #   #   #   |");
console.log("|                                                                            |");
console.log("|                                                         Un bot d'Imnibis   |");
console.log("`----------------------------------------------------------------------------´");

console.log("Initialisation de l'API Twitter...");
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
console.log("FAIT!");

console.log("Récupération des comptes que le bot follow...");
client.get("friends/ids", {screen_name: "AlexOTimeBot"}, (err, data, resp) => {
    if (!err) {
        console.log("FAIT!");
        start_bot(data.ids);
    } else console.log(err);
});

function start_bot(followed_ids) {
    console.log("En attente de tweets...");
    client.stream("statuses/filter", {follow: followed_ids.join(",")}, stream => {
        stream.on("data", tweet => {
            if (tweet.in_reply_to_status_id == null &&
                    tweet.user.screen_name == "imnibis") {
                console.log("----------");
                console.log(`Tweet reçu: "${tweet.text}"`);
                client.post("statuses/update", {status: "@imnibis Tu gères sa race",
                    in_reply_to_status_id: tweet.id_str}, (error, data, response) => {
                    if (!error) console.log("Réponse postée!");
                    else console.log(error);
                });
            }
        });
        stream.on("error", error => console.log(error));
    });
}