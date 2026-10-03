package com.example.testandroid;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        EditText editTextNumber = findViewById(R.id.editTextNumber);
        EditText editTextNumber2 = findViewById(R.id.editTextNumber2);
        Button button = findViewById(R.id.button);
        TextView textView = findViewById(R.id.textView);

        button.setOnClickListener( v ->{
            String num1Text = editTextNumber.getText().toString();
            String num2Text = editTextNumber2.getText().toString();

            if(num1Text.isEmpty() || num2Text.isEmpty()){
                textView.setText("Поля неможуть бути пустими! Заповніть їх");
                return;
            }

            double num1 = Double.parseDouble(num1Text);
            double num2 = Double.parseDouble(num2Text);
            double sum = num1 + num2;

            textView.setText("Результат" + sum);
        });


    }
}