//display navbar
//html must have <div class="navbar navbar-default navbar-static-top"></div>
$(function() {
  var container = $('.navbar.navbar-default.navbar-static-top');
  
  //add navbar to page
  container.append(
    "<div class='container-fluid'>" +
      "<div class='navbar-header'>" + 
            "<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>" +
              "<span class='sr-only'>Toggle navigation</span>" +
              "<span class='icon-bar'></span>" +
              "<span class='icon-bar'></span>" + 
              "<span class='icon-bar'></span>" +
            "</button>" + 
            "<a href='/' class='navbar-brand'>" + 
              "<span ref='triangles' class='triangles animated'>" +
                "<div class='tri invert'></div>" + 
                "<div class='tri invert'></div>" +
                "<div class='tri'></div>" +
                "<div class='tri invert'></div>"  +
                "<div class='tri invert'></div>"  +
                "<div class='tri'></div>" +
                "<div class='tri invert'></div>" +
                "<div class='tri'></div>" +
                "<div class='tri invert'></div>" +
              "</span>" +
              "E-Commerce Now" +
              "<span class='badge badge-up badge-danger'></span>" +
            "</a>" +
        "</div>" +
        "<div id='navbar' class='navbar-collapse collapse'>" +
          "<ul class='nav navbar-nav leftList'>" +
            "<li><a href='/'>Home</a></li>" +
            "<li id='usersContainer' style='display: none;'><a href='/users'>Users</a></li>" +
            "<li id='addProductContainter' style='display: none;'></li>" +
            "<li id='signupAddContainter' style='display: none;'>" +
              "<a>Sign up to access the full E-Commerce Now site!</a>" +
            "</li>" +
          "</ul>"  +
          "<ul class='nav navbar-nav navbar-right'>" +
            "<li class='dropdown' id='signupContainer' style='display: none;'>" +
              "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Signup<span class='caret signup'></span></a>" +
              "<ul class='dropdown-menu userForm'>" +
                "<form id='signup'>" +
                  "<input type='text' class='form-control' name='username' id='signupUsername' placeholder='Username'>" + 
                  "<input type='password' class='form-control' name='password' id='signupPassword' placeholder='Password'>" + 
                  "<input type='password' class='form-control' name='confirmPassword' id='signupConfirmPassword' placeholder='Confirm Password'>" +
                  "<button class='btn btn-primary' id='userFormButton' type='submit'>Sign Up</button>" +
                "</form>" +
              "</ul>" +
            "</li>" +
            "<li class='dropdown' id='loginContainer' style='display: none;'>" +
              "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Login <span class='caret'></span></a>" +
              "<ul class='dropdown-menu userForm'>" +
                "<form id='login'>" +
                  "<input type='text' class='form-control' name='username' id='loginUsername' placeholder='Username'>" + 
                  "<input type='password' class='form-control' name='password' placeholder='Password'>" + 
                  "<button class='btn btn-primary' id='userFormButton' type='submit'>Log In</button>" +
                "</form>" +
              "</ul>" +
            "</li>" +
            "<li class='dropdown' id='usernameContainer' style='display: none;'>" + 
              "<a href='#' id='user' class='dropdown-toggle user' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'></a>" +
              "<ul class='dropdown-menu'>" +
                "<li><a id='accountSettings' href='/account'>My Account</a></li>" + 
                "<li><a id='logoutButton'>Logout</a></li>" + 
              "</ul>" +
            "</li>" +
          "</ul>" +
        "</div>" +
      "</div>"
  );
  
  //add hidden signup modal to page
  container.append(
    "<div id='signupModal' class='modal'>" + 
      "<div class='modal-content'>" +
        "<span class='closeButton' id='closeButtonSignup'>×</span>" +
        "<div class='panel panel-default'>" +
          "<div class='panel-heading'>Sign up for E-Commerce Now!</div>" +
          "<div class='panel-body'>" +
            "<form id='signupModal'>" +
              "<input type='text' class='form-control' name='username' id='signupUsernameModal' placeholder='Username'>" +
              "<input type='password' class='form-control' name='password' id='signupPasswordModal' placeholder='Password'>" +
              "<input type='password' class='form-control' name='confirmPassword' id='signupConfirmPasswordModal' placeholder='Confirm Password'>" +
              "<button class='btn btn-primary' id='userFormButtonModal' type='submit'>" +
                "Sign Up" +
              "</button>" +
            "</form>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>"
  );
  
  //when the user submits the signup form
  $('#signupModal').submit(function(e) {
    //prevent standard form submission
    e.preventDefault();
    
    //ensure passwords match
    if ($('#signupConfirmPasswordModal').val() !== $('#signupPasswordModal').val()) {
      toastr.error('Passwords don\'t match!', { fadeAway: 2500 });
      return; 
    }
    
    //create query string from input fields
    var data = 'username=' + $('#signupUsernameModal').val() + '&password=' + $('#signupPasswordModal').val();
    
    $.ajax({
      type : 'post',
      url : '/signup',
      data : data
    }).done(function(response) {
      if (response.loggedIn) {
        location.reload();
      } else if (response.status === 'username taken') {
        toastr.error('Username is taken!', { fadeAway: 2500 });
      }
    }).fail(function(xhr, status, message) {
      toastr.error('Oh no! There was an error. Please try again.');
    });
  });
  
  //if user is logged in, add forms to navbar
  //else add the user information
  loggedIn();

  function loggedIn() {
    $.ajax({
      type : 'get',
      url : '/isLoggedIn',
    }).done(function(response) {
      if (response.loggedIn) {
        showUser(response.user);
      } else {
        showForms();
      }
    }).fail(function(xhr, status, message) {
      toastr.error('Oh no! There was an error. Please reload page.');
    });
  }
  
  //user has just logged in or signed up
  //remove the login forms
  //show user info and logout button
  function showUser(user) {
    
    //remove login/signup and signupAdd
    $('#signupContainer').hide();
    $('#loginContainer').hide();
    $('#signupAddContainter').hide();
    
    //show user in navbar
    $('#usernameContainer #user')
      .html(
        "Hi, " + user.username + "!" +
        "<span id='user' class='caret signup'></span>"
      );
    $('#usernameContainer').show();
    
    //display the 'edit' buttons on the products
    $('.edit-button').show();
    
    //display 'edit' button for product
    $('#editLink').show();
    
    //display 'users' link
    $('#usersContainer').show();
    
    //show products friends have reviewed
    $('#friends-products-field').show();
    
    //show the 'add product' button
    $('#addProductContainter')
      .append("<a href='/addProduct'>Add Product</a>")
      .show();
  }
  
  //show login and signup forms
  //hide username, logout button (if displayed)
  function showForms() {
    
    $('#usernameContainer').hide();
    $('#addProductContainter').hide();
    $('.edit-button').hide();
    $('#editLink').hide();
    $('#usersContainer').hide();
    $('#friends-products-field').hide();
    
    //show signupAdd
    if ($(window).width() > 1000) {
      $('#signupAddContainter').show();
    }
    $('#signupContainer').show();
    $('#loginContainer').show();
  }
  
  /** event listeners/bindings **/
  
  //when the user submits the signup form
  $('#signupContainer').submit(function(e) {
    //prevent standard form submission
    e.preventDefault();
    
    //ensure passwords match
    if ($('#signupConfirmPassword').val() !== $('#signupPassword').val()) {
      toastr.error('Passwords don\'t match!', { fadeAway: 2500 });
      return; 
    }
    
    //create query string from input fields
    var data = 'username=' + $('#signupUsername').val() + '&password=' + $('#signupPassword').val();
    
    $.ajax({
      type : 'post',
      url : '/signup',
      data : data
    }).done(function(response) {
      if (response.loggedIn) {
        location.reload();
      } else if (response.status === 'username taken') {
        toastr.error('Username is taken!', { fadeAway: 2500 });
        $('#signupContainer .dropdown-toggle').click();
      }
    }).fail(function(xhr, status, message) {
      toastr.error('Oh no! There was an error. Please try again.');
      $('#signupContainer .dropdown-toggle').click();
    });
  });
  
  //user submits login form
  $('#loginContainer').submit(function(e) {
      e.preventDefault();
      $.ajax({
        type : 'post',
        url : '/login',
        data : $('#login').serialize()
      }).done(function(response) {
        if (response.loggedIn) {
          location.reload();  
        } else if (response.status === 'no user') {
          toastr.error('Invalid username and/or password', { fadeAway: 2500 });
          $('#loginContainer .dropdown-toggle').click();
        }
        
      }).fail(function(xhr, status, message) {
        toastr.error('Oh no! There was an error. Please try again.');
        $('#signupContainer .dropdown-toggle').click();
      });
    });
  
  //user clicks logout button
  $("#logoutButton").click(function(e) {
    
    e.preventDefault();
    
    $.ajax({
      type : 'get',
      url : '/logout'
    }).done(function(response) {
      location = '/';
    }).fail(function(xhr, status, message) {
      toastr.error('Oh no! There was an error. Please try again.');
    });
  });
  
  // Get the modal
  var modal = document.getElementById('signupModal');

  // Get the <span> element that closes the modal
  var span = document.getElementById('closeButtonSignup');

  //event listeners for singup modal
  $(span).click(function() {
    $(modal).hide();
  });
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  
  //user clicks sign up/login text
  $('#signupAddContainter').click(function() {
    $(modal).show();
  });
  
});