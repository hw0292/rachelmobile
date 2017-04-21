// This is an add-on ZIM module for zim.Physics to help with Box2D and Zim gravity
// for assgnment

var zim = function (zim) {

	zim.PhysicsAddOn = function (frame, borders, physics) {

		if (physics == null) physics = new zim.Physics(frame, borders);
		
		this.physics = physics;
		var stage = frame.stage;
		var stageW = frame.width;
		var stageH = frame.height;

		var that = this;

		// add physics ball along with zim ball
		this.addBall = function (x, y, radius, angular, friction, restitution, dynamic, pic) {

			var duo; if (duo = zob(that.addBall, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = 0;
			if (radius == null) radius = 10;
			if (angular == null) angular = 0.75;
			if (friction == null) friction = 0;
			if (restitution == null) restitution = 0.7;
			if (dynamic == null) dynamic = true;
			

			var body;

			body = that.physics.makeCircle({
				radius: radius,
				angular: angular,
				friction: friction,
				restitution: restitution,
				dynamic: dynamic

			});

			// body.density = 1;
			// body.resetMassData(); // not working

			// 13. position and rotate the body
			body.x = x;
			body.y = y;
			// body.rotation = zim.rand(360);

			// mapping pic or zim circle
			if (pic == null) {
				// zim CIRCLE
				var circle = new zim.Circle(radius, frame.yellow);
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

		// add physics see saw along with zim rectangle		
		this.addSeeSaw = function (x, y, width, height, rotation, dynamic, friction, angular, restitution, triAxis) {

			var duo; if (duo = zob(that.addSeeSaw, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = stageH / 2;
			if (width == null) width = 150;
			if (height == null) height = 5;
			if (rotation == null) rotation = 10;
			if (dynamic == null) dynamic = true;
			if (friction == null) friction = 1;
			if (angular == null) angular = 0.75;
			if (restitution == null) restitution = 1;
			if (triAxis == null) triAxis = true;

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

			// Joint Definition
			if (triAxis == true) {
				var triBody = that.physics.makeTriangle(30, 30, 30, false);
				triBody.x = x;
				triBody.y = y;
				var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
				jointDef.bodyA = triBody;
				jointDef.bodyB = body;
				jointDef.localAnchorA = new b2Vec2(0, -0.4);

			} else {

				var triBody = that.physics.makeCircle(height, false);
				triBody.x = x;
				triBody.y = y;
				var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
				jointDef.bodyA = triBody;
				jointDef.bodyB = body;
				jointDef.localAnchorA = new b2Vec2(0, 0);

				// zim 
				var zimPic = new zim.Circle(height, frame.blue);
				zimPic.centerReg(stage);
				that.physics.addMap(triBody, zimPic);
			}

			// jointDef.localAnchorB = new b2Vec2(0, 0);

			// jointDef.enableMotor = true;
			// jointDef.motorSpeed = -10;
			// jointDef.maxMotorTorque = 50;

			that.physics.world.CreateJoint(jointDef);

			// zim Box
			var box = new zim.Rectangle(width, height, frame.orange);
			box.centerReg(stage);
			box.cursor = "pointer";

			// body.SetLinearVelocity(new b2Vec2(zim.rand(-5, 5), 0));

			that.physics.addMap(body, box);

		} //addSeeSaw

		// add cross along with zim rectangle		
		this.addCross = function (x, y, width, height, rotation, dynamic, friction, angular, restitution, motorSpeed) {

			var duo; if (duo = zob(that.addCross, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = stageH / 2;
			if (width == null) width = 100;
			if (height == null) height = 3;
			if (rotation == null) rotation = 0;
			if (dynamic == null) dynamic = true;
			if (friction == null) friction = 1;
			if (angular == null) angular = 1;
			if (restitution == null) restitution = 0.5;
			if (motorSpeed == null) motorSpeed = 0;

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
			// var triBody = that.physics.makeTriangle(10, 10, 10, false);
			var triBody = that.physics.makeCircle(10, false);
			triBody.x = x;
			triBody.y = y;

			// Joint Definition
			var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();

			jointDef.Initialize(body, triBody, body.GetWorldCenter(), triBody.GetWorldCenter());

			jointDef.enableMotor = true;
			jointDef.motorSpeed = motorSpeed;
			jointDef.maxMotorTorque = 50;

			that.physics.world.CreateJoint(jointDef);


			// bodyCross
			var bodyCross;

			bodyCross = that.physics.makeRectangle({
				width: width,
				height: height,
				dynamic: dynamic,
				angular: angular,
				restitution: restitution
			});

			bodyCross.x = x;
			bodyCross.y = y;

			var jointDef = new Box2D.Dynamics.Joints.b2WeldJointDef();

			jointDef.Initialize(body, bodyCross, body.GetWorldCenter(), bodyCross.GetWorldCenter());
			jointDef.referenceAngle = Math.PI / 2;
			that.physics.world.CreateJoint(jointDef);

			// zim Box
			var box = new zim.Rectangle(width, height, frame.orange);
			box.centerReg(stage);
			box.cursor = "pointer";
			that.physics.addMap(body, box);

			var box = new zim.Rectangle(width, height, frame.blue);
			box.centerReg(stage);
			box.cursor = "pointer";
			that.physics.addMap(bodyCross, box);

		} //addCross

		// add road not moving
		this.addRoad = function (x, y, width, height, rotation, dynamic, friction, angular, restitution) {
			var duo; if (duo = zob(that.addRoad, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = stageH / 2;
			if (width == null) width = stageW - 200;
			if (height == null) height = 5;
			if (rotation == null) rotation = 0;
			if (dynamic == null) dynamic = false;
			if (friction == null) friction = 0;
			if (angular == null) angular = 0.75;
			if (restitution == null) restitution = 0.5;

			var body;

			body = that.physics.makeRectangle({
				width: width,
				height: height,
				dynamic: dynamic,
				angular: angular,
				friction: friction,				
				restitution: restitution
			});

			// 13. position and rotate the body
			body.x = x;
			body.y = y;
			body.rotation = rotation;

			// zim Box
			var box = new zim.Rectangle(width, height, frame.blue);
			box.centerReg(stage);

			// body.SetLinearVelocity(new b2Vec2(zim.rand(-5, 5), 0));

			that.physics.addMap(body, box);

		} //addRoad

		// add multiple dominos with rectangle
		this.addDomino = function (n, deltaX, deltaY, x, y, width, height, rotation, dynamic, friction, angular, restitution, addBottom, pic) {

			var duo; if (duo = zob(that.addDomino, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = stageH / 2;
			if (width == null) width = 10;
			if (height == null) height = 80;
			if (rotation == null) rotation = 0;
			if (dynamic == null) dynamic = true;
			if (friction == null) friction = 0;
			if (angular == null) angular = 0;
			if (restitution == null) restitution = 0.5;
			if (addBottom == null) addBottom = true;

			if (n == null) n = 1;
			if (deltaY == null) deltaY = 0;
			if (deltaX == null) deltaX = height - 10 - Math.abs(deltaY) / 2.;


			var body;

			for (var i = 0; i < n; i++) {

				body = that.physics.makeRectangle({
					width: width,
					height: height,
					dynamic: dynamic,
					angular: angular,
					restitution: restitution
				});

				//position and rotate the body
				body.x = x + deltaX * i;
				body.y = y + deltaY * i;
				body.rotation = rotation;


				// zim Box
				// var box = new zim.Rectangle(width, height, frame.yellow);
				// box.centerReg(stage);
				// box.cursor = "pointer";
				// that.physics.addMap(body, box);

				// mapping pic or zim Box
				if (pic == null) {
					var box = new zim.Rectangle(width, height, frame.yellow);
					box.centerReg(stage);
					box.cursor = "pointer";
					that.physics.addMap(body, box);
				}
				else{
					// pic
					var picClone = pic.clone().centerReg(stage);
					that.physics.addMap(body, picClone);				
				}



				// bottom of domino
				if (addBottom == true) {
					var bottom = that.physics.makeRectangle({
						width: width * 2,
						height: 7,
						dynamic: false
					});

					bottom.x = body.x;
					bottom.y = body.y + body.height / 2 + bottom.height * 2;
				}
			}

		} //addCross

		// add pendant
		this.addPendant = function (x, y, radius, angular, friction, restitution, centerX, centerY) {

			var duo; if (duo = zob(that.addPendant, arguments)) return duo;

			if (x == null) x = stageW / 2;
			if (y == null) y = 0;
			if (radius == null) radius = 10;
			if (angular == null) angular = 0.75;
			if (friction == null) friction = 0;
			if (restitution == null) restitution = 1;

			var pendant = that.addBall(x, y, radius, angular, friction, restitution);
			// Joint Tryangle
			// var triBody = that.physics.makeTriangle(10, 10, 10, false);
			var center = that.physics.makeCircle(3, false);
			center.x = x;
			center.y = y + 50;

			// Joint Definition
			var jointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef	();

			jointDef.Initialize(center, pendant, center.GetWorldCenter(), pendant.GetWorldCenter());
			// jointDef.length = 5;

			that.physics.world.CreateJoint(jointDef);

			// zim Box not working
			// var zimBox = new zim.Rectangle(50, 1, frame.green);
			// zimBox.centerReg(stage);
			// that.physics.addMap(jointDef, zimBox);			

		} //addPendant
	};

	return zim;

}(zim || {});
