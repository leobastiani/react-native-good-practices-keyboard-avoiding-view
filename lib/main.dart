import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Flutter Demo',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Column(
        children: [
          const Text('Top!'),
          const TextField(),
          Expanded(
            flex: 3,
            child: Container(
              color: Colors.grey.shade200,
            ),
          ),
          const TextField(),
          Expanded(
            flex: 1,
            child: Container(
              color: Colors.grey.shade300,
            ),
          ),
          const Text('Bottom!')
        ],
      )),
    );
  }
}
