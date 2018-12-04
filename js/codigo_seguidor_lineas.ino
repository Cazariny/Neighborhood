

// Seguidor de linea negra con sensor TCRT5000


int VelocidadMotor1 = 5; //ENA
int VelocidadMotor2 = 9; //ENB
int Motor1A = 6; //IN2
int Motor1B = 7;  //IN1
int Motor2C = 8; //IN4
int Motor2D = 10; //IN3

int infraPin = 2;    // izquierdo - pin del infrarrojos utilizado como entrada digital
int infraPin1=4;  //  derecho
int valorInfra = 0;  // Valor inicial de la lectura digital del infrarrojos izquierdo 
int valorInfra1 = 0;  // derecho



void setup() {
  delay(5000);
   pinMode(infraPin, INPUT);    
   pinMode(infraPin1, INPUT); 
   pinMode(Motor1A,OUTPUT);
   pinMode(Motor1B,OUTPUT);
   pinMode(Motor2C,OUTPUT);
   pinMode(Motor2D,OUTPUT);
   pinMode(VelocidadMotor1, OUTPUT);
   pinMode(VelocidadMotor2, OUTPUT);
   
    analogWrite(VelocidadMotor1, 138); //motor izquierdo
    analogWrite(VelocidadMotor2, 120);  //motor derecho
       
      digitalWrite(Motor1A, LOW);
      digitalWrite(Motor1B, LOW);
      digitalWrite(Motor2C, LOW);
      digitalWrite(Motor2D, LOW);

}

void loop() {
   valorInfra = digitalRead(infraPin);    // valor de la entrada que lee el infrarrojo izquierdo
   valorInfra1 = digitalRead(infraPin1);  // derecho
             
           

   // 0 = blanco / 1 = negro
  
  if(valorInfra == 0 && valorInfra1 == 0){ // Hacia delante
     
  digitalWrite(Motor1A, HIGH);
      digitalWrite(Motor2D, HIGH);
      delay(20);                      // Tiempo para control de velocidad
      digitalWrite(Motor1A, LOW);
      digitalWrite(Motor2D,LOW);
       delay(20);                     // Tiempo para control de velocidad
}

 if(valorInfra == 0 && valorInfra1 == 1){  // Giro derecha
     digitalWrite(Motor1A, LOW);
      digitalWrite(Motor2D,LOW);
       delay(25);
  digitalWrite(Motor1A, HIGH);
      digitalWrite(Motor2D,LOW);
      delay(20);
     
}

 if(valorInfra == 1 && valorInfra1 == 0){ // Giro izquierda

  digitalWrite(Motor1A,LOW);
      digitalWrite(Motor2D, LOW);
          delay(25);
           digitalWrite(Motor1A,LOW);
      digitalWrite(Motor2D, HIGH);
      delay(20);
}

 if(valorInfra == 1 && valorInfra1 == 1){  // STOP
     
  digitalWrite(Motor1A, LOW);
      digitalWrite(Motor1B, LOW);
      digitalWrite(Motor2C, LOW);
      digitalWrite(Motor2D, LOW);
      
}

}
