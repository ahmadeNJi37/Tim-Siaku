<?php

namespace Database\Seeders;

use App\Models\FeeGroup;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(class: FacultySeeder::class);

        $this->call(class: FeeGroupSeeder::class);



         User::factory()->create([
             'name' => 'Monkey D Luffy',
             'email' => 'Luffy@siakubwa.test',
         ])->assignRole(Role::create([
            'name' => 'Admin'
         ]));

         $operator = User::factory()->create( attributes: [
            'name' => 'Zoro',
            'email' => 'zoro@siakubwa.test',
         ])->assignRole(Role::create( attributes: [
            'name' => 'Operator',
         ]));

         $operator->operator()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'employee_number' => str()->padLeft(mt_rand( min: 0, max: 999999), 6, '0'),
         ]);

          $teacher = User::factory()->create( attributes: [
            'name' => 'Sanji',
            'email' => 'sanji@siakubwa.test',
         ])->assignRole(Role::create( attributes: [
            'name' => 'Teacher',
         ]));

         $teacher->teacher()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'teacher_number' => str()->padLeft(mt_rand( min: 0, max: 999999), 6, '0'),
            'academic_title' => 'Asisten Ahli',
         ]);

           $student = User::factory()->create( attributes: [
            'name' => 'Usup',
            'email' => 'usup@siakubwa.test',
         ])->assignRole(Role::create( attributes: [
            'name' => 'Student',
         ]));

         $student->student()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'fee_group_id' => rand( min: 1, max: 6),
            'student_number' => str()->padLeft(mt_rand( min: 0, max: 999999), 6, '0'),
            'semester' => 1,
            'batch' => 2025,
         ]);
    }
}
