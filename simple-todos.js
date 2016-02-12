Equations = new Mongo.Collection("equations");

if (Meteor.isServer) {
  Meteor.publish("equations", function () {
    return Equations.find();
  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("equations");

  Template.body.helpers({
    equations: function () { return Equations.find({}, { sort: { createdAt: -1 } });}
  });

  Template.body.events({
    "submit .new-equation": function (event) {
      console.log("new equation submitted");
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;
      var evaluated;
      try {
        evaluated = eval(text)
      } catch (e){
        evaluated = "????"
      }


      var username = event.target.username.value;

      // Insert a equation into the collection
      Meteor.call("addEquation", text + "=" + evaluated, username);

      // Clear form
      event.target.text.value = "";
    }
  });
}

Meteor.methods({
  addEquation: function (text, username) {
    Equations.insert({
      text: text,
      createdAt: new Date(),
      username: username
    });
  }
});
