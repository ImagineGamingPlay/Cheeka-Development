const TagSchema = require('../../schema/tags.js');

module.exports = {
    name:'tag',
    description:'Tag system in modified form.',
    aliases:['t'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run:async(client,message,args)=>{
        console.log('works?')

        const query = args[0]?.toLowerCase() ?? false;
        if(!query) return message.reply('Please specify the tag name or use "create" , "delete" , "edit" to make changes')
        if(query === 'create'){
            //will be added soon

        } else if(query === 'delete'){
        //add basic from cheekus current code?
        } else if(query === 'edit'){
            //this part will be done after create and delete

        } else {
            await TagSchema.findOne({Name:query},async(error,data)=>{
                if(error) console.log(error)
                if(data){
                    message.reply({content:`${data.Code}`, allowedMentions:[{repliedUser:false,everyone:false}]})
                } else {
                    return message.reply('Couldnt find any valid tags by that name')
                }
            })
        }
    }
}