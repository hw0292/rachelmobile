// This is an pinball ZIM module for zim.Physics to help with Box2D and Zim gravity

var zim = function (zim) {

	zim.PhysicsPinBall = function (frame, borders, physics) {

		if (physics == null) physics = new zim.Physics(frame, borders);
		
		this.physics = physics;
		var stage = frame.stage;
		var stageW = frame.width;
		var stageH = frame.height;

		var that = this;


		// add cross along with zim rectangle		
		this.addFlipper = function (position, x, y, width, height, rotation, dynamic, friction, angular, restitution, motorSpeed, pic) {

			var duo; if (duo = zob(that.addFlipper, arguments)) return duo;

			if (position == null) position = "left";
			if (x == null) x = stageW / 2;
			if (y == null) y = stageH / 2;
			if (width == null) width = 75;
			if (height == null) height = 8;
			if (rotation == null) rotation = 0;
			if (dynamic == null) dynamic = true;
			if (friction == null) friction = 0;
			if (angular == null) angular = 1;
			if (restitution == null) restitution = 1;
			if (motorSpeed == null) motorSpeed = 10;

			var body;

			body = that.physics.makeRectangle({
				width: width,
				height: height,
				dynamic: dynamic,
				angular: angular,
				restitution: restitution
			});

			
			// 13. position and rotate the body
			body.x = x;
			body.y = y;
			body.rotation = rotation;

			// Joint Tryangle
			// var pivot = that.physics.makeTriangle(10, 10, 10, false);
			var pivot = that.physics.makeCircle(1, false);

			pivot.x = (position == "left") ? x - width/2 : x + width/2;
			// pivot.x = x  - width/2;
			pivot.y = y;

			// Joint Definition
			var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();

			// jointDef.Initialize(body, pivot, body.GetWorldCenter(), pivot.GetWorldCenter());
			jointDef.Initialize(body, pivot, pivot.GetWorldCenter());

			// jointDef.enableMotor = true;
			// jointDef.motorSpeed = motorSpeed;
			// jointDef.maxMotorTorque = 50;

			jointDef.upperAngle = .6;  
			jointDef.lowerAngle = -.6;  
			jointDef.enableLimit = true;  
			jointDef.maxMotorTorque = 50.0;  
			jointDef.motorSpeed = (position == "left") ? -motorSpeed : motorSpeed;
			jointDef.enableMotor = true;  
			
			jointDef.collideConnected = true;

			var jointWorld = that.physics.world.CreateJoint(jointDef);
			
			// zog("motor speed: " + jointWorld.GetMotorSpeed());
			// jointWorld.SetMotorSpeed(10);

			// cover pic
			if (pic == null) {
			// zim Box
				var box = new zim.Rectangle(width, height, frame.orange);
				box.centerReg(stage);
				box.cursor = "pointer";
				that.physics.addMap(body, box);

			}
			else{
				// pic
				
				var picClone = pic.clone().centerReg(stage);
					that.physics.addMap(body, picClone);				
			}



			return jointWorld;

		} //addFlipper

		// add Pinball ball along with zim ball
		this.addBall = function (x, y, radius, angular, density, friction, restitution, dynamic, pic) {

			var duo; if (duo = zob(that.addBall, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = 0;
			if (radius == null) radius = 10;
			if (angular == null) angular = 0.75;
			if (density == null) density = 0.5;
			if (friction == null) friction = 0;
			if (restitution == null) restitution = 0.3;
			if (dynamic == null) dynamic = true;
			

			var body;

			body = that.physics.makeCircle({
				radius: radius,
				angular: angular,
				density: density,	
				friction: friction,
				restitution: restitution,
				dynamic: dynamic
			});

			body.ApplyImpulse(new b2Vec2(0,-zim.rand(12,25)/10.), body.GetWorldCenter());
 

			// 13. position and rotate the body
			body.x = x;
			body.y = y;
			// body.rotation = zim.rand(360);

			// mapping pic or zim circle
			if (pic == null) {
				// zim CIRCLE
				var ciƒrcle = new zim.Circle(radius, frame.yellow);
				circle.center(stage);
				circle.cursor = "pointer";
				// add a little inner circle to see it spin
				var inner = new zim.Circle(radius / 2, frame.green);
				inner.x = radius / 4;
				circle.addChild(inner);

				that.physics.addMap(body, circle);
			}
			else{
				// pic
				
				// pic.centerReg(stage);
				// that.physics.addMap(body, pic);	

				var picClone = pic.clone().centerReg(stage);
					that.physics.addMap(body, picClone);				
			}

			return body;


		} //addBall
		

	} // zim.PhysicsPinBall

	return zim;

}(zim || {});
