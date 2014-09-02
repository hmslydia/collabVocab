Meteor.publish('words', function(){
  return Words.find()
})

Meteor.publish('stageData', function(page){
  //var user_id = Meteor.userId()
  //var page = Meteor.user.profile[stage_type].page
  var user_id = this.userId
  var profile = Meteor.users.findOne(this.userId).profile
  var currentStage = profile.currentStage
  var currentStageData = profile[currentStage]
  var stage_type = currentStage
  //var page = currentStageData.page
  var page = parseInt(page)
  //return StageData.find({user_id: user_id, stage_type: stage_type, page: page})
  console.log(user_id, stage_type, page)
  console.log(StageData.find({user_id: user_id, stage_type: stage_type, page: page}).count())
  return StageData.find({user_id: user_id, stage_type: stage_type, page: page}, 
    {fields: {public_data:1, stage_meta_data_id: 1, page:1}})
    
})

Meteor.publish('stageMetaData', function(){
  return StageMetaData.find()
})

