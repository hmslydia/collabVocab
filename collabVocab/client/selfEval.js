difficultyOptions = [
  {name: "gotIt", display: "Got it"}, 
  {name: "someReview" , display: "Some Review"}, 
  {name: "needToLearn", display: "Need to learn"},
  {name: "hard", display: "Hard"},
]

Template.selfEval.helpers({
  vocab: function() {
    //var page = parseInt(Meteor.user().profile.selfEval.page)
    var page = parseInt(Router.current().params.page)
        
    //find the vocab words for this pages
    var wordsAndDefinitions = StageData.find({page:page}).fetch() //Words.find({page: page}).fetch()
    return wordsAndDefinitions
  },
  difficultyOptions: function(index){
    return difficultyOptions[index].display
  }
});

function validate(quizForm){
  var numAnswered = quizForm.length
  
  //find number of radio buttons with unique names
  var radioQuestions = $('input:radio')
  var radioNames = _.map(radioQuestions, function(radioQuestion){
    return $(radioQuestion).attr('name')
  })
  var radioNames = _.uniq(radioNames)
  var numRadioButtons = radioNames.length
  
  if (numAnswered == numRadioButtons){
    return true
  }else{
    return false
  }
}



function submitSelfEval(quizForm) {
    var selfEvals = []
    _.each(quizForm, function(quizObj){
      var name = quizObj.name
      var word_id = name.substring(0, name.indexOf("_"))
      selfEvals.push({word_id:word_id, eval: quizObj.value})
    })
    Meteor.call('submitSelfEval', selfEvals, function(){
      console.log(Meteor.user().profile.selfEval)
      goToNextSelfEval()
    })      
}

function goToNextSelfEval(){
  var selfEvalStatus = Meteor.user().profile.selfEval.status  
  if (selfEvalStatus == "completed" ){
    Router.go('welcome')
  }else{
    var newPage = parseInt(Meteor.user().profile.selfEval.page)
    Router.go('selfEval', {page: newPage}) 
    //Router.go('selfEval')
  }
}

Template.selfEval.events({
  'submit' : function(event) {
    var quizForm = $('#form').serializeArray()
    event.preventDefault(); 
    if(validate(quizForm)){
      submitSelfEval(quizForm);      
    }
  }
});