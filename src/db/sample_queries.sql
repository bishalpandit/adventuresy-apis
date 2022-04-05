-- Query for Setting Booking Availability for Adventures w.r.t Partners

select adventure_id, 
(select title from adventures a where a.id = adventure_id ), 
(select summary from adventures a where a.id = adventure_id ), 
(select img_link from adventures a where a.id = adventure_id ) 
from reviews rev 
join reservations res
on rev.reservation_id = res.id 
join partneradventurelink pa 
on res.partneradventurelink_id = pa.id 
join adventures adv
on pa.adventure_id = adv.id 
group by adventure_id
order by avg(rating) desc;

insert into bookingavailability(partner_id, adventure_id, avail_dates)
values('f519ae65-4bfb-429e-ab64-114a23f4092a','2427b7df-f565-426e-a375-b0fb8d2dbcf1', 
	   ARRAY[date('2022-03-12'),
	   	date('2022-03-15'),
	   	date('2022-03-16'),
	   	date('2022-03-20')
	   ]);

select a.title, p.name, ba.avail_dates from bookingavailability ba
join partners p on p.id = ba.partner_id
join adventures a on a.id = ba.adventure_id;

select * from partners;

select * from adventures;

-- D-M622

select * from adventures;

insert into partneradventurelink(partner_id, adventure_id)
values('a741a231-d61d-418b-91d4-e8851c901a26','04605ad4-9a2b-4e99-92ba-7d10079d24cf');

select * from partneradventurelink;

select * from adventureprices;

alter table adventureprices
add constraint partadvenlinkfk foreign key(partneradventurelink_id) references partneradventurelink(id);

alter table partneradventurelink
add constraint partadvtlink_pk primary key(id);

select * from adventureprices ap 
join partneradventurelink pal on pal.id = ap.partneradventurelink_id
join partners p on pal.partner_id = p.id
join adventures a on pal.adventure_id = a.id;

update Adventures
set img_link = 'paragliding.jpg'
where title = 'Parasailing in Malaysia';



select * from reservations res
join partneradventurelink pa 
on res.partneradventurelink_id = pa.id 
join adventures adv
on pa.adventure_id = adv.id;
select * from users;
select * from partneradventurelink;
select * from reviews;

insert into reservations(user_id, start_date, end_date, persons, price, tax, total, partneradventurelink_id) values('05330f2a-85c5-42ff-8c33-f15e60067fca', '2022-05-01', '2022-05-08', 1, 20000, 400, 20400, '05f1a5dc-bb81-4960-8a0d-6c5151703ce7');

alter table reservations
ADD CONSTRAINT fk_partneradventurelink FOREIGN key(partneradventurelink_id) REFERENCES partneradventurelink(id);

update reviews
set rating = 4.5
where id = '71b455d1-d6f2-49b8-8778-af7d14ce296a';
delete from reviews
where id = 'b8c122ae-7e8d-4edc-90f7-12632a17db81';


insert into reviews(reservation_id, content, rating)
values('4042f6c3-6418-4d6a-9912-f03441b3f3cc', 'It was really fun but scary also.', 3.5);