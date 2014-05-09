var targetPos : Vector3;

function Update () {

	transform.RotateAround(targetPos, Vector3.up,25*Time.deltaTime);
}