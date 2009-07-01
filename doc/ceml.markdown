Introducing CEML
================

CEML is the world's first programming language custom-built for bringing people together.

All assignments and reassignments given through the viewer are actually CEML programs which are then executed on the server, resulting in a test message-, IM-, or mobile application-based coordination.

A sample program
----------------

    "some quiet time"
    takes 10m
    offers quiet observation connection peace
    involves many agents, 1 landmark
    
    tell agents {
        at |landmark|, find a place to sit w hands on left leg
        in silence, listen to noises in the park
        after |duration|, cough gently and leave one at a time
    }

or the slightly more complex rendezvous:

    "a high five"
    takes 2m
    offers connection inclusion
    involves 1 mobile_agent, 1 stationary_agent, 1 streetcorner
    
    link stationary_agent ==> mobile_agent {
        askfor clothing: What are you wearing (so the other person can recognize you)?
    }
    
    tell stationary_agent {
        mill around at |streetcorner|
        a stranger will approach you and give you a high five
        when that happens nod and run in the direction they came from
        find some trash and clean it up
    }
    
    tell mobile_agent {
        go to |streetcorner| and
        find someone wearing |clothing|
        give them a high five
        nod, and keep walking around the corner
    }

There are more examples at /app/ideas.ceml, and the parser is at /lib/gc_api/ceml.js.

Other resources
---------------

There is a TextMate bundle which does syntax highlighting for CEML.  Someone will make a vim mode soon.

Reference - Commands
--------------------

CEML has a small number of keywords at this point:  `involves`, `tell`, `link`, and `askfor` are the main four, and `takes` and `offers` have a supporting role.

### askfor [varname] [question]

Used in a link clause to indicate that the information for the second role/group can be obtained by asking someone in the first role/group the question provided.

### tell [role] [assignment]

Says to give the assignment to the people who match the role.  Note that the assignment may have variables embedded within it, in which case the server will attempt to get values by asking questions, etc, before sending these assignments.

### link [role1] ==> [role2] [block]

Describes a way to get information from the role1 people and offer it to the role2 people.  See `askfor`.  In the future, there will be other mechanisms such as voting and various interactive methods.

### involves rolespec1, rolespec2, ... [block]

Declares a set of roles which need to be satisfied in order to run this script.

### offers [tags]

Helps the user or the system pick which agents to involve, based on what they're up for.

### takes [duration] [optional skill tags]

Also helps the user or the system pick which agents to involve, based on their skills and/or available time.

Reference - Syntax
------------------

The syntax is simple and a bit like a cross between tcl and ruby.  Every line starts with a command keyword, contains some arguments, possibly a special qualifier in parens, and possibly a block. 

Since so many commands take a string as their last arg, there is a special syntax.  A unquoted colon anywhere in the string means to take what follows as a string argument.

Advanced keywords
-----------------

Please ignore this section for now.

### snippet [satisfiers] [snippet]

CEML requires all assignments to satisfy a set of satisfiers.. initially, these are called "goto", "meet", "cue", "act", "end", and "exit", and every assignment which is sent out needs to have instructions which seem to provide instructions for these.  The snippet command defines an alternate set of snippets which can be used to satisfy these requirements.
