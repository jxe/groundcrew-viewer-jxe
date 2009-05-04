String.elisions = { n: 1 };

$.extend(String.prototype, {

  elide: function(pfx){
    var e = pfx + String.elisions.n;
    String.elisions[e] = this;
    String.elisions.n += 1;
    return e;
  },

  unelide: function() {
    return String.elisions[this] || this;
  },
  
  trimWhitespace: function(){
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }
  
});

Array.prototype.push_all = function(x){
  var me = this;
  $.each(x, function(){ me.push(this); });
};





Snippets = { };
Gamebook = [];
Rolebook = { };

CEML = {
  // no ops in js
  ask: function(args, context)        { ;;; },
  re: function(args, context, block)  { ;;; },
  type: function(args, context)       { ;;; },
  
  provides: function(args, context) {
    context.offering.provides = args[0];
  },
  
  
  // =================
  // = basic parsing =
  // =================
  
  parse: function(block) {
    RegExp.multiline = true;

    // elide braces
    var changed;
    do {
      changed = false;
      block = block.
      replace(/\{\s*([^{}]+)\s*\}/g, function(_, str){ 
        changed = true; 
        return str.elide('@'); 
      });
    } while (changed);
    
    // console.log(block);
    CEML.context(null, {}, block);
  },
  
  eval: function(block, context) {
    $.each(CEML.lines(block, true), function(){
      CEML.eval_line(this, context);
    });
  },
  
  lines: function(block, is_code) {
    // get rid of comments
    var x = block.replace(/\/\/.*/g, '');
    
    if (is_code) {
      x = x.
      // elide special strings
      replace(/:\s+(.*)\n/g,      function(_, str){ return " " + str.trimWhitespace().elide('`') + "\n"; }).
      // elide double quote strings
      replace(/"(.*?)"/g,        function(_, str){ return str.elide('`'); }).
      // elide parens
      replace(/\(([^)]+)\)/g, function(_, str){ return str.elide('()'); });
    }
    // alert(x);
    return x.split(/\n/);
  },
  
  eval_line: function(line, context) {
    if (/^\s*$/.test(line)) return;
    line = line.trimWhitespace();
    var words = line.split(' ');
    var cmd = words.shift();
    var block;
    var parens;
    if (words[0] && words.last()[0] == '@') block = words.pop().unelide();
    if (words[0] && words.last()[0] == '(') parens = words.pop().unelide();
    var args = words.map(function(x){ return x.unelide(); });
    if (CEML[cmd]) {
      try {
        CEML[cmd](args, context, block, parens);
      } catch(e) {
        alert('error during ceml run: ' + e + "\non line: " + cmd + ' ' + args.join(' ') + ' ' + block);
        console.log(e);
        throw(e);
      }
      
    } else {
      alert('ceml error: ' + cmd + '::' + args.join(' ') + ' ' + block);
      bomb();
    }
  },
  
  context: function(args, context, block) {
    CEML.eval(block, CEML.child_context(context));
  },
  
  child_context: function(context) {
    return $.extend({
      generic_roles: { 'all': CEML.new_role() }
    }, context);
  },
  

  // =========
  // = roles =
  // =========
  
  new_role: function(rolename, context) {
    var role = { 
      name: rolename, 
      assignment: {}
    };
    
    if (context) {
      var parent;
      if (parent = context.generic_roles['all'])
        $.extend(role.assignment, parent.assignment);
      if (parent = context.generic_roles[rolename])
        $.extend(role.assignment, parent.assignment);
    }
    
    return role;
  },
  
  all_roles: function(context) {
    if (context.offering) return context.offering.all_roles;
    else return [context.generic_roles['all']];
  },
  
  role: function(rolename, context) {
    if (context.offering) {
      var x = context.offering.roles[rolename];
      if (x) return x;
      else alert('no role named ' + rolename);
    }
    else {
      var x = context.generic_roles[rolename];
      if (!x) x = context.generic_roles[rolename] = CEML.new_role();
      return x;
    }
  },
  
  expand_roles: function(rolespec, context) {
    if (rolespec == 'all') return CEML.all_roles(context);
    return [CEML.role(rolespec, context)];
  },
  
  offering: function(args, context, block, paren) {
    context = CEML.child_context(context);
    Gamebook[Gamebook.length] = context.offering = {
      name: args[0],
      all_roles: [],
      roles: {}
    };
    
    var roles = paren.split('; ')[0].split(', ');
    $.each(roles, function(){
      var word = this.split(' ');
      var count = word[0];
      var rolename = word[1];
      var role = CEML.new_role(rolename, context);
      context.offering.all_roles.push(role);
      context.offering.roles[rolename] = role;
      Rolebook[args[0] + '/' + rolename] = role;
    });
    
    CEML.eval(block, context);
  },
  
  
  // ============================
  // = snippets and assignments =
  // ============================
  
  snippet_matches: function(line) {
    var simple = line.replace(/\|[^\|]+\||\[[^\]]+\]/g, 'X').trimWhitespace();
    // console.log('line simplified to ['+simple+']');
    // if (Snippets[simple]) console.log('found ['+Snippets[simple].join(', ')+']');
    return Snippets[simple] ? Snippets[simple].concat([]) : ['act'];
  },
  
  snippet: function(args) {
    Snippets[args[1].trimWhitespace()] = args[0].split('/');
  },
  
  everyone: function(args, context, block) {
    CEML.every(['all'], context, block);
  },
  
  all: function(args, context, block) {
    CEML.every(args, context, block);
  },
  
  every: function(args, context, block) {
    $.each(CEML.expand_roles(args[0], context), function(){
      var role = this;
      $.each(CEML.lines(block), function(){
        var line = this;
        if (/^\s*$/.test(line)) return;
        var functions = [];
        line = line.replace(/\s+\(:([\w\/]+):\)\s*/g, function(_, x){
          functions.push_all(x.split('/'));
          return '';
        }).trimWhitespace();
        if (functions.length == 0) {
          // autodetect function
          functions = CEML.snippet_matches(line);
        }
        // console.log('assigning to functions ['+functions.join(', ')+']');
        var primary_function = functions.shift();
        if (role.assignment[primary_function]) {
          alert('ceml error: ' + role.name +'/'+ primary_function + ' is assigned twice!');
          alert('prev: ' + role.assignment[primary_function]);
          alert('new: ' + line);
          bomb();
        }
        role.assignment[primary_function] = line;
        $.each(functions, function(){ 
          if (!role.assignment[this]) role.assignment[this] = ' '; 
        });
      });
    });
  }
    
};


//   idea: function(context, args, block) {
//     args.roles = [];
//     block.ceml_parse_block(args);
//     _idea("Idea__" + args.first, Number(args.rank || 20), args.roles[0].invite['for'], args.roles[0].features, args);
//   },
