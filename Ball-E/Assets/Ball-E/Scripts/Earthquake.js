#pragma strict

private var timer : float = 0.0;
private var nextQuake : float = 5.0;
private var inProgress : boolean = false;

function Update() {
	if (!inProgress) {
		timer += Time.deltaTime;
	}

	if (timer >= nextQuake) {
		Quake();
	}
}

function Quake() {
	inProgress = true;
	timer = 0.0;
	nextQuake = Mathf.Abs(Random.Range(5,10));
	
	var location : Vector3 = Vector3(Mathf.Abs(Random.Range(0,8)) * 6 + 1, 2, Mathf.Abs(Random.Range(0,8)) * 6 - 1);
	var hitColliders = Physics.OverlapSphere(location, 1.5);
	for (var i = 0; i < hitColliders.Length; i++) {
		if (hitColliders[i].gameObject.name == "Powerup(Clone)") {
			Destroy(hitColliders[i].gameObject);
		}
		else if (hitColliders[i].transform.parent && hitColliders[i].transform.parent.GetComponent(Block)) {
			hitColliders[i].transform.parent.rigidbody.constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionZ;
			hitColliders[i].transform.parent.GetComponent(Block).timer += 10.0;
			hitColliders[i].transform.parent.GetComponent(Block).falling = true;
		}	
	}

	yield WaitForSeconds(1);		

	inProgress = false;
}