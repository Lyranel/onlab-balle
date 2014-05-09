#pragma strict

var timer : float = 0.0;
var falling : boolean = false;
/*var owner: int = 0;
private var capturing : int = 0;
private var interrupt : boolean = false;*/

function Update () {
	if (timer > 0) {
		timer -= Time.deltaTime;
	}
	else if (falling) {
		timer = 0;
		falling = false;
		rigidbody.constraints = RigidbodyConstraints.FreezeAll;
		transform.position = Vector3(transform.position.x, 0, transform.position.z);
   	}
}