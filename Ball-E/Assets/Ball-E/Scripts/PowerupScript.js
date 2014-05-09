#pragma strict

private var timer : float;

function Start() {
	timer = 15.0;
}

function Update () {
	timer -= Time.deltaTime;
	if (timer < 0) {
		Destroy(gameObject);
	}
}