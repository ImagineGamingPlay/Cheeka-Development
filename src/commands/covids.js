const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'covid',
    aliases: ["covid19","corona"] ,
    category: "utility",
    description: "To find the number of Covid Cases.",
    usage: "%covid + [countries] | all",
    run: async (client, message, args) => {
        const countries = args.join(" ");
        if (!args[0])
            return message.channel.send('Usage [command] + all | countries');
        if (args[0] === "all") {
            const url = `https://disease.sh/v3/covid-19/all`
            let   response = await fetch(url).then(res => res.json())
            const embed = new MessageEmbed()
                .setTitle(`Worldwide COVID-19 Stats 🌎`)
                .setThumbnail(`https://i.imgur.com/dJ52ckG.jpg`)
                .addField('Total Cases', response.cases.toLocaleString())
                .addField('Total Deaths', response.deaths.toLocaleString())
                .addField('Total Recovered', response.recovered.toLocaleString())
                .addField('Active Cases', response.active.toLocaleString())
                .addField('Critical Cases', response.critical.toLocaleString())
                .addField('Todays Deaths', response.todayDeaths.toLocaleString())
                .addField('Today Recoveries', response.todayRecovered.toLocaleString())
            message.channel.send({embeds : [embed]})
        } else {
            const url = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(countries)}`
            let response
           response = await fetch(url).then(res => res.json())
            try {
                const embed = new MessageEmbed()
                    .setTitle(`COVID-19 Stats for **${countries}**`)
                    .setThumbnail(response.countryInfo.flag)
                    .addField('Total Cases', response.cases.toLocaleString())
                    .addField('Total Deaths', response.deaths.toLocaleString())
                    .addField('Total Recovered', response.recovered.toLocaleString())
                    .addField('Active Cases', response.active.toLocaleString())
                    .addField('Critical Cases', response.critical.toLocaleString())
                    .addField('Todays Deaths', response.todayDeaths.toLocaleString())
                    .addField('Today Recoveries', response.todayRecovered.toLocaleString())
                message.channel.send({embeds : [embed]})
            } catch {
                message.channel.send('Country not found')
            }
        }
    }
}
