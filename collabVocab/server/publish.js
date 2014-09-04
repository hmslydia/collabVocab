Meteor.publish('words', function(){
  return Words.find()
})

Meteor.publish('stageData', function(page){ 
  var user_id = this.userId
  var profile = Meteor.users.findOne(this.userId).profile
  var currentStage = profile.currentStage
  var currentUnitId = profile.currentUnitId
  var currentStageData = profile[currentStage]
  var stage_type = currentStage
  var page = parseInt(page)
  return StageData.find({user_id: user_id, stage_type: stage_type, page: page, unit_id: currentUnitId}, 
    {fields: {public_data:1, stage_meta_data_id: 1, page:1}})
    
})

Meteor.publish('stages', function(){
  return Stages.find()
})


Meteor.publish('units', function(){
  var user_id = this.userId
  return Units.find({user_id: user_id})
})
