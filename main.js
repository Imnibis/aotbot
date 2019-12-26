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
var Twitter = require('twitter-lite');
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
console.log("FAIT!");

console.log("Récupération des comptes que le bot follow...");
client.get("friends/ids", {screen_name: "AlexOTimeBot"})
    .then(data => {
    console.log("FAIT!");
    start_bot(data.ids);
}).catch(console.error);

function start_bot(followed_ids)
{
    console.log("En attente de tweets...");
    client.stream("statuses/filter", {follow: followed_ids.join(",")})
        .on("data", on_tweet)
        .on("error", console.error);
}

function on_tweet(tweet)
{
    if(tweet.text.startsWith("RT")) return;
    console.log("----------");
    console.log(`Tweet reçu: "${tweet.text}"`);
    if (tweet.user.screen_name == "imnibis") {
        client.post("favorites/create", {id: tweet.id_str})
            .then(data => console.log("Tweet autoliké!"))
            .catch(console.error);
    } else if(tweet.in_reply_to_status_id == null) search_tweet(tweet);
}

function search_tweet(tweet)
{
    console.log("Recherche du tweet...");
    client.post("tweets/search/fullarchive/dev",
        {query: "" + tweet.text.substring(0, 256)})
        .then(data =>
    {
        console.log("Trouvé! Réponse en cours...");
        var source = data.results[data.results.length - 1];
        client.post("statuses/update", {status:
            `@${tweet.user.screen_name} Voler c'est pas bien.`,
            in_reply_to_status_id: tweet.id_str,
            attachment_url: `https://twitter.com/${source.user.screen_name}/status/${source.id_str}`})
            .then((error, data, response) => console.log("Réponse postée!"))
            .catch(console.error);
    }).catch(console.error);
}