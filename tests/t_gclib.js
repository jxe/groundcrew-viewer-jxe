module('gclib');

test("to_f", function(){
	var x = { foo:"bar" };
	var y = function(x){ return x.foo; };
	equals( 'bar', to_f(y)(x) );
	equals( 'bar', to_f('.foo')(x) );
});


test("rebuzz", function(){
	var x = rebuzz([1, 2, 3], function(){ return ['a', 'b', 'c']; }, function(x){ return x; });
	equals( 3, x.length );
	ok( x[0], x[0] );
	ok( x[0][0] );
	ok( x[0].bin, x[0].bin );
	equals( 3, x[0].length );
});


test("tag", function(){
  equals( tag('a', {content: "foo"}), '<a href="#">foo</a>' );
});


test('json_eval', function(){
  equals( json_eval('{a:"b"}').a, "b" );
});


test("contains", function(){
  ok( [1, 2, 3].contains(3) );
  ok( ![1, 2, 3].contains(4) );
});


test("pluralize", function(){
  equals( pluralize(3, 'agent'), "3 agents" );
  equals( pluralize(1, 'agent'), "1 agent" );
});


test("map", function(){
  x = [{x:2}].map('.x');
  ok( x.length == 1 );
  ok( x[0] == 2 );
});


test("sort_by", function(){
  
  var x = [1, 2, 3, 4, 5];
  var y = x.sort_by(function(z){ return -z; });
  
  ok( y[0] == 5, y[0] );
  ok( y[4] == 1 );
  
});

test('max and sum', function(){
  ok( [1, 2, 3].max() == 3 );
  ok( [1, 2, 3].sum() == 6 );
});
